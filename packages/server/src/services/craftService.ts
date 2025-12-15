import { CraftRecipe, CraftResult, Technique } from '@cas/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CraftService {
 // Основная функция крафта техники
  static async craftTechnique(recipe: CraftRecipe): Promise<CraftResult> {
    try {
      // Проверяем, что все компоненты существуют
      const rudiment = await prisma.rudimentTemplate.findUnique({
        where: { id: recipe.rudimentId }
      });

      if (!rudiment) {
        return {
          success: false,
          failureReason: 'Invalid rudiment ID'
        };
      }

      // Проверяем фрагменты понимания
      const fragments = await prisma.fragmentTemplate.findMany({
        where: {
          id: { in: recipe.fragmentIds }
        }
      });

      if (fragments.length !== recipe.fragmentIds.length) {
        return {
          success: false,
          failureReason: 'One or more fragment IDs are invalid'
        };
      }

      // Создаем новую технику
      const techniqueName = this.generateTechniqueName(rudiment.name, fragments, recipe.essence);
      const newTechnique: Technique = {
        id: `tech_${Date.now()}`, // Временный ID
        name: techniqueName,
        description: this.generateTechniqueDescription(rudiment, fragments, recipe.essence),
        rudimentId: rudiment.id,
        fragmentIds: recipe.fragmentIds,
        essence: recipe.essence,
        elementType: this.determineElement(rudiment, fragments, recipe.essence),
        level: 1,
        isExperimental: this.isExperimentalCraft(fragments)
      };

      return {
        success: true,
        technique: newTechnique
      };
    } catch (error) {
      console.error('Crafting error:', error);
      return {
        success: false,
        failureReason: 'Internal error during crafting'
      };
    }
 }

  // Генерация имени техники на основе компонентов
  private static generateTechniqueName(rudimentName: string, fragments: any[], essence: string): string {
    // Создаем словесный банк для генерации имен
    const prefixes = {
      fire: ['Огненный', 'Пламенный', 'Пылающий', 'Испепеляющий'],
      water: ['Ледяной', 'Морозный', 'Хладный', 'Водяной'],
      earth: ['Каменный', 'Земной', 'Тяжёлый', 'Непоколебимый'],
      air: ['Воздушный', 'Порывистый', 'Легкий', 'Штормовой'],
      darkness: ['Теневой', 'Призрачный', 'Мрачный', 'Ночного'],
      light: ['Светлый', 'Сияющий', 'Лучезарный', 'Светоносный']
    };

    const suffixes = {
      fire: ['Гнев', 'Пыл', 'Жар', 'Испепелитель'],
      water: ['Холод', 'Лёд', 'Волна', 'Стужа'],
      earth: ['Удар', 'Щит', 'Обвал', 'Крепость'],
      air: ['Порыв', 'Шторм', 'Вихрь', 'Буря'],
      darkness: ['Клинок', 'Покров', 'Тьма', 'Тень'],
      light: ['Свет', 'Благодать', 'Сияние', 'Просветление']
    };

    // Определяем элемент на основе рудимента и эссенции
    const element = essence.toLowerCase();
    
    const prefix = this.getRandomElement(prefixes[element as keyof typeof prefixes] || [rudimentName]);
    const suffix = this.getRandomElement(suffixes[element as keyof typeof suffixes] || ['Техника']);

    // Добавляем уникальные компоненты из фрагментов
    const fragmentNames = fragments.map(f => f.name).filter(Boolean);
    if (fragmentNames.length > 0) {
      const fragmentAdjective = this.getRandomElement(fragmentNames);
      return `${fragmentAdjective} ${prefix} ${suffix}`;
    }

    return `${prefix} ${suffix}`;
  }

  // Генерация описания техники
  private static generateTechniqueDescription(rudiment: any, fragments: any[], essence: string): string {
    const descriptions = {
      damage: `Мощная техника стихии ${essence}, усиливающая базовое умение "${rudiment.name}"${fragments.length > 0 ? ` фрагментами: ${fragments.map(f => f.name).join(', ')}` : ''}.`,
      control: `Контрольная техника стихии ${essence}, модифицирующая базовое умение "${rudiment.name}"${fragments.length > 0 ? ` фрагментами: ${fragments.map(f => f.name).join(', ')}` : ''}.`,
      defense: `Защитная техника стихии ${essence}, адаптирующая базовое умение "${rudiment.name}"${fragments.length > 0 ? ` фрагментами: ${fragments.map(f => f.name).join(', ')}` : ''}.`
    };

    return descriptions[rudiment.baseType as keyof typeof descriptions] || 
           `Техника стихии ${essence}, основанная на базовом умении "${rudiment.name}"${fragments.length > 0 ? ` с использованием фрагментов: ${fragments.map(f => f.name).join(', ')}` : ''}.`;
  }

  // Определение элемента техники
  private static determineElement(rudiment: any, fragments: any[], essence: string): string {
    // В простой реализации - элемент определяется эссенцией
    // В более сложной системе можно добавить логику смешивания элементов
    return essence;
  }

  // Проверка, является ли крафт экспериментальным
  private static isExperimentalCraft(fragments: any[]): boolean {
    // В простой реализации - если используется более 2 фрагментов, это эксперимент
    return fragments.length > 2;
  }

  // Вспомогательный метод для получения случайного элемента
  private static getRandomElement<T>(array: T[]): T {
    if (array.length === 0) return undefined as any;
    return array[Math.floor(Math.random() * array.length)];
  }
}