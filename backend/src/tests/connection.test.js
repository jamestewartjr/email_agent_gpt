const supabase = require('../config/supabase');

describe('Supabase Connection', () => {
  it('should connect to Supabase successfully', async () => {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .limit(1);
    
    expect(error).toBeNull();
    // Even if no rows exist, data should be an empty array
    expect(Array.isArray(data)).toBe(true);
  });
}); 