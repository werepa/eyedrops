import { ExameService } from "src/app/services/exame.service"
import { InMemoryRepository } from "./InMemoryRepository"

export const InMemoryProvider = [
  {
    provide: ExameService,
    useFactory: (repository: any) => {
      return new ExameService(repository)
    },
    inject: [InMemoryRepository],
  },
]
