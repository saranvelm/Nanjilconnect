import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://npzgylwkhgemmulvcxpu.supabase.co';
const supabaseAnonKey = 'sb_publishable_f-SsnJP2NZaoPnVXTIUFWw_y0TGm5yk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);