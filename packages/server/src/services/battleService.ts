import { BattleSetup, BattleResult, BattleLogEntry } from '@cas/shared';
import { NarrativeGenerator } from './narrativeService';

export interface BattleContext {
  player: any; // Временно any, позже заменим на конкретный тип
  enemy: any;  // Временно any, позже заменим на конкретный тип
  location: string;
  turn: number;
  playerHealth: number;
  enemyHealth: number;
  playerEnergy: number;
 enemyEnergy: number;
}

export class BattleService {
  static async startBattle(battleSetup: BattleSetup): Promise<BattleResult> {
    // Инициализация боя
    const context: BattleContext = {
      player: battleSetup.playerTechniques[0], // Временно - первый элемент
      enemy: battleSetup.enemyTechniques[0],  // Временно - первый элемент
      location: battleSetup.location,
      turn: 0,
      playerHealth: 100,
      enemyHealth: 100,
      playerEnergy: 100,
      enemyEnergy: 100
    };

    const log: BattleLogEntry[] = [];
    const startTime = Date.now();

    // Простой пошаговый бой до победы одного из участников
    while (context.playerHealth > 0 && context.enemyHealth > 0 && context.turn < 50) { // Ограничение на 50 ходов
      context.turn++;

      // Ход игрока
      const playerAction = this.executeTurn(context, 'player');
      log.push(...playerAction);

      if (context.enemyHealth <= 0) {
        break;
      }

      // Ход противника (бота)
      const enemyAction = this.executeTurn(context, 'enemy');
      log.push(...enemyAction);

      if (context.playerHealth <= 0) {
        break;
      }
    }

    const duration = Date.now() - startTime;

    return {
      winner: context.playerHealth > 0 ? 'player' : 'enemy',
      log,
      duration
    };
 }

  private static executeTurn(context: BattleContext, actor: 'player' | 'enemy'): BattleLogEntry[] {
    const logEntries: BattleLogEntry[] = [];
    const attacker = actor === 'player' ? context.player : context.enemy;
    const defender = actor === 'player' ? context : 
      { health: context.playerHealth, energy: context.playerEnergy };
    
    // Временно: простая механика атаки
    const damage = Math.floor(Math.random() * 20) + 10; // Случайный урон от 10 до 30
    
    if (actor === 'player') {
      context.enemyHealth -= damage;
    } else {
      context.playerHealth -= damage;
    }
    
    // Генерируем текстовое описание действия
    const techniqueName = 'Тестовая техника'; // Временно
    const targetName = actor === 'player' ? 'Противник' : 'Игрок';
    
    const actionDescription = NarrativeGenerator.generateBattleAction(
      actor === 'player' ? 'Игрок' : 'Противник',
      {
        name: techniqueName,
        elementType: 'fire', // Временно
        baseType: 'damage'   // Временно
      },
      targetName,
      damage
    );
    
    logEntries.push({
      turn: context.turn,
      actor: actor,
      action: actionDescription,
      target: actor === 'player' ? 'enemy' : 'player',
      damage: damage
    });
    
    // Добавляем информацию о здоровье
    logEntries.push({
      turn: context.turn,
      actor: 'system',
      action: `Здоровье игрока: ${context.playerHealth}, Здоровье противника: ${context.enemyHealth}`
    });

    return logEntries;
  }
}