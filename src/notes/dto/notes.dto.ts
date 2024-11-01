import { NoteType, VisibilityType } from "../notes.entity";

export class CreateNoteDto {
    name: string;
    nameId: string;
    content?: string;
    noteType?: NoteType;
    relatedLinks?: string[];
    dependencies?: string[];
    blockedBy?: string[];
    questions?: string[];
    tags?: string[];
    status?: string;
    startDate?: Date;
    endDate?: Date;
    discussedWith?: string[];
    sharedWith?: string[];
    visibility?: VisibilityType;
  }

export class UpdateNoteDto extends CreateNoteDto {}
  