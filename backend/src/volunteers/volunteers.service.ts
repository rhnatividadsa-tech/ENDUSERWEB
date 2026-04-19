import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class VolunteersService {
  constructor(private readonly supabase: SupabaseService) {}

  async createVolunteer(data: any) {
    const client = this.supabase.getClient();
    const { data: dbData, error } = await client
      .from('volunteer_applications')
      .insert([
        {
          role_id: 'b5000001-0000-0000-0000-000000000001',
          volunteer_auth_id: 'b0000000-0000-0000-0000-000000000004',
          motivation: `Role requested: ${data.role} | Site: ${data.siteLocation}`,
          skills: data, // Save the entire form object for context
          availability: data.timeSlot,
          status: 'pending',
          applied_at: new Date()
        }
      ])
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    return dbData;
  }

  async getVolunteers() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('volunteer_applications')
      .select('*')
      .order('applied_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    return data;
  }
}
