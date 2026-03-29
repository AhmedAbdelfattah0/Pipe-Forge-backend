import { supabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { InsertGeneration, Generation } from '../../../database/types/database.types.js';

export class GenerationRepository {
  async create(data: InsertGeneration): Promise<Generation> {
    const { data: row, error } = await supabaseAdmin
      .from('generations')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to save generation: ${error.message}`, 500);
    }
    return row as Generation;
  }
}
