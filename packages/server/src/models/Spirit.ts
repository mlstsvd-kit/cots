import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SpiritData {
 id: string;
 name: string;
 description: string;
 element: string;
  character: string;
  uniqueMechanic: string;
  isActive: boolean;
}

export interface RudimentData {
  id: string;
  name: string;
  description: string;
  baseType: string;
  elementType: string;
  isActive: boolean;
}

export class SpiritService {
  // Получить все духи
  static async getAllSpirits(): Promise<SpiritData[]> {
    const spirits = await prisma.spiritTemplate.findMany({
      where: { isActive: true }
    });
    
    return spirits.map(spirit => ({
      id: spirit.id,
      name: spirit.name,
      description: spirit.description,
      element: spirit.element,
      character: spirit.character,
      uniqueMechanic: spirit.uniqueMechanic,
      isActive: spirit.isActive
    }));
 }

  // Получить дух по ID
  static async getSpiritById(id: string): Promise<SpiritData | null> {
    const spirit = await prisma.spiritTemplate.findUnique({
      where: { id }
    });
    
    if (!spirit) return null;
    
    return {
      id: spirit.id,
      name: spirit.name,
      description: spirit.description,
      element: spirit.element,
      character: spirit.character,
      uniqueMechanic: spirit.uniqueMechanic,
      isActive: spirit.isActive
    };
 }

  // Получить рудименты духа
  static async getSpiritRudiments(spiritId: string): Promise<RudimentData[]> {
    const rudiments = await prisma.rudimentTemplate.findMany({
      where: { spiritId, isActive: true }
    });
    
    return rudiments.map(rudiment => ({
      id: rudiment.id,
      name: rudiment.name,
      description: rudiment.description,
      baseType: rudiment.baseType,
      elementType: rudiment.elementType,
      isActive: rudiment.isActive
    }));
  }

  // Создать тестовые духи (для начальной инициализации)
  static async createInitialSpirits() {
    const initialSpirits = [
      {
        name: 'Огненный Бык',
        description: 'Упрямый, неостановимый, прямолинейный. Ненавидит отступать. Мыслит категориями "преграда" — "проломить".',
        element: 'fire',
        character: 'Упрямый, неостановимый, прямолинейный',
        uniqueMechanic: 'Раскалённый Разгон — каждое последовательное перемещение к врагу увеличивает силу следующей атаки. Стояние на месте снижает заряд.',
      },
      {
        name: 'Ледяной Мамонт',
        description: 'Величие, спокойствие, древняя печаль. Помнит эпохи оледения. Защищает своих.',
        element: 'water',
        character: 'Величие, спокойность, древняя печаль',
        uniqueMechanic: 'Вечная Мерзлота — создаёт ледяное поле под собой. Враги на поле замедлены, союзники (включая себя) получают повышенную защиту.',
      },
      {
        name: 'Каменный Медведь',
        description: 'Древний, мудрый, терпеливый. Как гора. Не суетится, его атаки неотвратимы.',
        element: 'earth',
        character: 'Древний, мудрый, терпеливый',
        uniqueMechanic: 'Каменная Форма — при получении урона есть шанс полностью его проигнорировать (как скала). Шанс растёт при низкой скорости передвижения.',
      },
      {
        name: 'Дубовый Страж',
        description: 'Медленный, добрый, но грозный при опасности для леса. Говорит шелестом листьев.',
        element: 'earth',
        character: 'Медленный, добрый, но грозный',
        uniqueMechanic: 'Корневая Система — стоя на месте, постепенно восстанавливает здоровье и накладывает "Оковы Корней" на приближающихся врагов.',
      },
      {
        name: 'Призрачный Оборотень',
        description: 'Меланхоличный, одинокий охотник. Проклят вечно скитаться. Ненавидит свою форму.',
        element: 'darkness',
        character: 'Меланхоличный, одинокий охотник',
        uniqueMechanic: 'Фазовый Сдвиг — может на короткое время стать полностью неосязаемым, проходя сквозь препятствия и избегая урона, но не может атаковать.',
      }
    ];

    for (const spirit of initialSpirits) {
      const existingSpirit = await prisma.spiritTemplate.findUnique({
        where: { name: spirit.name }
      });

      if (!existingSpirit) {
        await prisma.spiritTemplate.create({
          data: {
            name: spirit.name,
            description: spirit.description,
            element: spirit.element,
            character: spirit.character,
            uniqueMechanic: spirit.uniqueMechanic,
            isActive: true
          }
        });
      }
    }

    // Создаем рудименты для каждого духа
    await this.createInitialRudiments();
  }

 static async createInitialRudiments() {
    // Получаем ID духов для создания рудиментов
    const spirits = await prisma.spiritTemplate.findMany({
      where: { name: { in: ['Огненный Бык', 'Ледяной Мамонт', 'Каменный Медведь', 'Дубовый Страж', 'Призрачный Оборотень'] } }
    });

    for (const spirit of spirits) {
      let rudiments = [];
      
      if (spirit.name === 'Огненный Бык') {
        rudiments = [
          { name: 'Таран', description: 'Мощная атака с приближением к врагу', baseType: 'damage', elementType: 'fire' },
          { name: 'Рычание Вызова', description: 'Деморализующий крик, снижающий вражескую защиту', baseType: 'control', elementType: 'fire' },
          { name: 'Топот', description: 'Сотрясение земли, наносящее урон ближайшим врагам', baseType: 'damage', elementType: 'earth' },
          { name: 'Пылающий Взрыв', description: 'Массовый огненный взрыв', baseType: 'damage', elementType: 'fire' }
        ];
      } else if (spirit.name === 'Ледяной Мамонт') {
        rudiments = [
          { name: 'Ледниковое Дыхание', description: 'Замораживающее дыхание, замедляющее врагов', baseType: 'control', elementType: 'water' },
          { name: 'Бивень-Таран', description: 'Пронзающая атака с бивнями', baseType: 'damage', elementType: 'earth' },
          { name: 'Ступающий Мороз', description: 'Создает ледяную волну, наносящую урон и замедляющую', baseType: 'control', elementType: 'water' },
          { name: 'Зов Стада', description: 'Призывает духов стада для защиты', baseType: 'defense', elementType: 'earth' }
        ];
      } else if (spirit.name === 'Каменный Медведь') {
        rudiments = [
          { name: 'Разламывающая Лапа', description: 'Мощная атака лапой, пробивающая защиту', baseType: 'damage', elementType: 'earth' },
          { name: 'Землетрясение', description: 'Сотрясает землю, нанося урон и оглушая врагов', baseType: 'control', elementType: 'earth' },
          { name: 'Каменная Кожа', description: 'Временное увеличение защиты', baseType: 'defense', elementType: 'earth' },
          { name: 'Грозный Рёв', description: 'Пугающий рёв, снижающий атаку врагов', baseType: 'control', elementType: 'earth' }
        ];
      } else if (spirit.name === 'Дубовый Страж') {
        rudiments = [
          { name: 'Удар Стволом', description: 'Мощный удар стволом, наносящий урон и отбрасывающий', baseType: 'damage', elementType: 'earth' },
          { name: 'Призыв Сплетения Корней', description: 'Создает корни, опутывающие врагов', baseType: 'control', elementType: 'earth' },
          { name: 'Целительный Сок', description: 'Восстанавливает здоровье союзникам', baseType: 'defense', elementType: 'earth' },
          { name: 'Шелест Угрозы', description: 'Пугающий шелест листьев, снижающий точность врагов', baseType: 'control', elementType: 'air' }
        ];
      } else if (spirit.name === 'Призрачный Оборотень') {
        rudiments = [
          { name: 'Призрачный Укус', description: 'Наносит урон сквозь защиту', baseType: 'damage', elementType: 'darkness' },
          { name: 'Вой Полной Луны', description: 'Увеличивает силу всех темных техник в радиусе', baseType: 'damage', elementType: 'darkness' },
          { name: 'Преследующий Шаг', description: 'Телепортирует к врагу, нанося урон', baseType: 'damage', elementType: 'darkness' },
          { name: 'Раздирающие Тени', description: 'Создает теневые ловушки, наносящие урон при активации', baseType: 'control', elementType: 'darkness' }
        ];
      }

      for (const rudiment of rudiments) {
        const existingRudiment = await prisma.rudimentTemplate.findUnique({
          where: { name_spiritId: { name: rudiment.name, spiritId: spirit.id }
        });

        if (!existingRudiment) {
          await prisma.rudimentTemplate.create({
            data: {
              name: rudiment.name,
              description: rudiment.description,
              baseType: rudiment.baseType,
              elementType: rudiment.elementType,
              spiritId: spirit.id,
              isActive: true
            }
          });
        }
      }
    }
  }
  
  // Метод для получения уникальной механики духа
  static async getUniqueMechanic(spiritId: string) {
    const spirit = await prisma.spiritTemplate.findUnique({
      where: { id: spiritId },
      select: { uniqueMechanic: true }
    });
    
    return spirit?.uniqueMechanic || '';
  }
  
  // Метод для получения характера духа
  static async getSpiritCharacter(spiritId: string) {
    const spirit = await prisma.spiritTemplate.findUnique({
      where: { id: spiritId },
      select: { character: true }
    });
    
    return spirit?.character || '';
 }
}