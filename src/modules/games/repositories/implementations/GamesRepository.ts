import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where(`games.title ilike :title`, { title: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(1) FROM GAMES`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder("games")
      .select([
        "user.first_name first_name",
        "user.last_name last_name",
        "user.email email",
      ])
      .innerJoin(
        "users_games_games",
        "user_games",
        "user_games.gamesId = games.id"
      )
      .innerJoin("users", "user", "user_games.usersId = user.id")
      .where("games.id = :id", { id })
      .getRawMany();
  }
}
