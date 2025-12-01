import TagsRepository, { Tag } from "../repositories/tags-repository";

export class TagsService {
  private tagsRepo: TagsRepository;

  constructor(tagsRepo: TagsRepository = new TagsRepository()) {
    this.tagsRepo = tagsRepo;
  }

  async searchTags(query: string): Promise<Tag[]> {
    return this.tagsRepo.search(query);
  }

  async createTag(name: string): Promise<Tag> {
    return this.tagsRepo.save({ name });
  }
}

export default TagsService;

export const tagsService = new TagsService();
