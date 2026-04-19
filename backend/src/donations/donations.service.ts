import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DonationsService {
  constructor(private readonly supabase: SupabaseService) {}

  async createDonation(data: any) {
    const client = this.supabase.getClient();
    
    const rows = data.items.map((item: any) => ({
      campaign_id: 'b3000001-0000-0000-0000-000000000001',
      donor_auth_id: 'b0000000-0000-0000-0000-000000000002',
      tracking_number: 'WEB-' + Date.now(),
      message: `Drop-off at ${data.siteLocation} | Time: ${data.timeSlot}`,
      status: 'pending',
      donated_at: new Date(),
      item_name: item.name,
      quantity: parseInt(item.qty) || 1,
    }));

    const { data: dbData, error } = await client
      .from('donations')
      .insert(rows)
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    return dbData;
  }

  async getDonations() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('donations')
      .select('*')
      .order('donated_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    return data;
  }
}
