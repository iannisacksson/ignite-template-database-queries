import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('game')
      .where(`game.title ILIKE '%${param}%'`)
      .getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const [_, total] = await this.repository.findAndCount();

    return [{count: total.toString()}]
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository.createQueryBuilder('game').leftJoinAndSelect('game.users', 'users').getMany();

    const [users] = games.map(game => game.users);
    
    return users;
  }
}
