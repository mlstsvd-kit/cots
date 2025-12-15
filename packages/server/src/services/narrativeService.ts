import { BattleLogEntry } from '@cas/shared';

export interface LocationContext {
  name: string;
  element: string;
  timeOfDay: string;
  weather: string;
}

export interface SpiritContext {
  name: string;
  element: string;
  character: string;
  uniqueMechanic: string;
}

export interface TechniqueContext {
  name: string;
  elementType: string;
 baseType: string;
}

export class NarrativeGenerator {
  // Базовые словесные банки
 private static readonly EPITHETS: Record<string, string[]> = {
    fire: ['пылающий', 'пламенный', 'огненный', 'жгучий', 'испепеляющий'],
    water: ['ледяной', 'морозный', 'холодный', 'ледяной', 'морозный'],
    earth: ['каменный', 'глиняный', 'тяжелый', 'непоколебимый', 'скалистый'],
    air: ['воздушный', 'ветреный', 'легкий', 'порывистый', 'непостоянный'],
    darkness: ['тень', 'мрак', 'тьма', 'призрачный', 'незримый'],
    light: ['светлый', 'сияющий', 'лучезарный', 'освещающий', 'светоносный']
  };

  private static readonly VERBS: Record<string, string[]> = {
    damage: ['наносит', 'поражает', 'вонзает', 'ударяет', 'сокрушает'],
    control: ['подчиняет', 'оглушает', 'замедляет', 'обездвиживает', 'подавляет'],
    defense: ['защищает', 'укрепляет', 'усиливает', 'оберегает', 'закаляет']
  };

  // Генерация описания входа в локацию
  static generateLocationEntry(
    playerName: string,
    location: LocationContext,
    spirit: SpiritContext
  ): string {
    const locationEpithet = this.getRandomElement(
      this.EPITHETS[location.element] || ['таинственный']
    );
    
    const spiritPhrase = this.generateSpiritReaction(spirit, location);
    
    return `"${locationEpithet.charAt(0).toUpperCase() + locationEpithet.slice(1)} воздух ${location.name} обволакивает вас. ${
      spirit.name
    }, ${spirit.character.toLowerCase()}, ${spiritPhrase} Вы чувствуете ${
      this.getRandomElement(['тяжёлую атмосферу', 'давление', 'напряжение', 'энергию'])
    } ${
      location.element === 'fire' ? 'огня' : 
      location.element === 'water' ? 'воды' : 
      location.element === 'earth' ? 'земли' : 
      location.element === 'air' ? 'воздуха' : 
      location.element === 'darkness' ? 'тьмы' : 'энергии'
    } на коже."`;
  }

  // Генерация реакции духа
  private static generateSpiritReaction(spirit: SpiritContext, location: LocationContext): string {
    const reactions: Record<string, string[]> = {
      'Огненный Бык': [
        `утверждает: 'Здесь ${this.getRandomElement(['должно', 'нужно', 'можно'])} проломить путь!'`,
        `рычит: 'Пламя очистит всё!'`,
        `бормочет: 'Сопротивление только разжигает огонь!'`
      ],
      'Ледяной Мамонт': [
        `шепчет: 'Здесь холод пронизывает душу...'`,
        `утверждает: 'Мой мороз несёт покой, а не смерть.'`,
        `вздыхает: 'Я помню времена, когда здесь был ледник.'`
      ],
      'Каменный Медведь': [
        `мурлычет: 'Горы не воюют. Они просто стоят на пути.'`,
        `рычит: 'Моя скала непоколебима.'`,
        `бормочет: 'Терпение — сила гор.'`
      ],
      'Дубовый Страж': [
        `шелестит: 'Мои корни чувствуют историю этого места.'`,
        `шепчет: 'Лес помнит всё.'`,
        `вздыхает: 'Природа требует защиты.'`
      ],
      'Призрачный Оборотень': [
        `воет: 'Это место полнит меня силой.'`,
        `шепчет: 'Тьма — моя тюрьма и моя сила.'`,
        `ворчит: 'Я чувствую запах добычи.'`
      ]
    };
    
    return this.getRandomElement(reactions[spirit.name] || ['молчит, оглядывая окрестности.']);
  }

  // Генерация описания боевого действия
  static generateBattleAction(
    playerName: string,
    technique: TechniqueContext,
    targetName: string,
    damage?: number,
    effect?: string
  ): string {
    const techniqueEpithet = this.getRandomElement(
      this.EPITHETS[technique.elementType] || ['таинственный']
    );
    
    const verb = this.getRandomElement(
      this.VERBS[technique.baseType] || ['применяет']
    );
    
    let action = `${playerName} ${verb} ${techniqueEpithet} ${technique.name}!`;
    
    if (damage) {
      action += ` ${this.capitalizeFirst(
        this.getRandomElement(['раскатистый грохот', 'оглушительный взрыв', 'вспышка света', 'волну энергии'])
      )}, ${this.getRandomElement(['пронзивший', 'сотрясший', 'охвативший', 'поразивший'])} поле боя. ${targetName} ${
        this.getRandomElement(['отшатнулся', 'покачнулся', 'затрепетал', 'взвыл'])
      }, ${this.getRandomElement(['получив', 'схватив', 'поглощенный', 'пораженный'])} ${damage} урона.`;
    } else {
      action += ` ${this.getRandomElement(['создавая', 'вызывая', 'формируя'])} ${this.getRandomElement(['энергетическую волну', 'магический паттерн', 'силовое поле', 'элементальную вспышку'])}.`;
    }
    
    if (effect) {
      action += ` ${this.getRandomElement(['В результате', 'Вследствие этого', 'Как следствие'])} ${effect}.`;
    }
    
    return action;
  }

 // Генерация описания активации ауры
  static generateAuraActivation(
    playerName: string,
    spirit: SpiritContext,
    auraName: string
  ): string {
    const auraEffects = [
      'мир будто замер',
      'воздух наполнился энергией',
      'пространство засияло',
      'атмосфера изменилась'
    ];
    
    const spiritReaction = this.generateAuraSpiritReaction(spirit);
    
    return `"${this.capitalizeFirst(this.getRandomElement(auraEffects))}, когда ${playerName} высвободил${this.getGenderSuffix(playerName)} свою силу. ${
      this.getRandomElement(['Ослепительное', 'Завораживающее', 'Пугающее', 'Величественное'])
    } ${
      this.getRandomElement(['сияние', 'сверкание', 'мерцание', 'свечение'])
    } ${this.getRandomElement(['поглотило', 'охватило', 'наполнило', 'пронизало'])} всё вокруг. ${
      spirit.name
    } ${spiritReaction} ${
      this.getRandomElement(['Энергия', 'Сила', 'Мощь', 'Власть'])
    } ${auraName} ${this.getRandomElement(['наполнила', 'пронизала', 'укрепила', 'возвысила'])} ${
      this.getRandomElement(['атмосферу', 'пространство', 'воздух', 'мир'])
    }."`;
  }

  private static generateAuraSpiritReaction(spirit: SpiritContext): string {
    const reactions: Record<string, string[]> = {
      'Огненный Бык': [
        `рычит: 'Пламя вспыхнуло ярче!'`,
        `утверждает: 'Вот это сила!'`,
        `восклицает: 'Сожжём всё дотла!'`
      ],
      'Ледяной Мамонт': [
        `шепчет: 'Холод распространяется.'`,
        `утверждает: 'Мир замерзает.'`,
        `вздыхает: 'Мой лёд вечен.'`
      ],
      'Каменный Медведь': [
        `рычит: 'Гора растёт.'`,
        `утверждает: 'Непоколебимость возвышена.'`,
        `бормочет: 'Скала крепка.'`
      ],
      'Дубовый Страж': [
        `шелестит: 'Лес расцветает.'`,
        `шепчет: 'Природа возвышена.'`,
        `вздыхает: 'Корни укреплены.'`
      ],
      'Призрачный Оборотень': [
        `воет: 'Тьма подчиняется.'`,
        `шепчет: 'Тени пришли.'`,
        `ворчит: 'Ночь в моём распоряжении.'`
      ]
    };
    
    return this.getRandomElement(reactions[spirit.name] || ['наблюдает.']);
  }

  // Вспомогательные методы
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

 private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static getGenderSuffix(playerName: string): string {
    // Временное решение - возвращаем 'а' для простоты
    return 'а';
  }
}