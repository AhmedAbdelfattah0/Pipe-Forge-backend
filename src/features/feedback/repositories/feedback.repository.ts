import { supabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { InsertFeedback, Feedback } from '../../../database/types/database.types.js';

export class FeedbackRepository {
  async create(data: InsertFeedback): Promise<Feedback> {
    const { data: row, error } = await supabaseAdmin
      .from('feedback')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to save feedback: ${error.message}`, 500);
    }
    return row as Feedback;
  }

  async getPublicTestimonials(): Promise<Feedback[]> {
    const { data: rows, error } = await supabaseAdmin
      .from('feedback')
      .select('*')
      .eq('is_public', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw new AppError(`Failed to fetch testimonials: ${error.message}`, 500);
    }
    return (rows ?? []) as Feedback[];
  }
}
