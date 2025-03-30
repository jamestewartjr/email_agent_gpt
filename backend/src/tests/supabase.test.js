const supabase = require('../config/supabase');

describe('Supabase Integration', () => {
  let testEmailId;

  afterEach(async () => {
    // Clean up test data
    if (testEmailId) {
      await supabase.from('emails').delete().eq('id', testEmailId);
    }
  });

  it('should insert and retrieve an email', async () => {
    // Test data
    const testEmail = {
      sender: 'test@example.com',
      subject: 'Test Email',
      received_at: new Date().toISOString(),
      body: 'This is a test email body',
      attachments: []
    };

    // Insert test email
    const { data: insertedEmail, error: insertError } = await supabase
      .from('emails')
      .insert(testEmail)
      .select()
      .single();

    expect(insertError).toBeNull();
    expect(insertedEmail).toBeTruthy();
    testEmailId = insertedEmail.id;

    // Verify the email was inserted correctly
    const { data: retrievedEmail, error: retrieveError } = await supabase
      .from('emails')
      .select('*')
      .eq('id', testEmailId)
      .single();

    expect(retrieveError).toBeNull();
    expect(retrievedEmail).toBeTruthy();
    expect(retrievedEmail.sender).toBe(testEmail.sender);
    expect(retrievedEmail.subject).toBe(testEmail.subject);
    expect(retrievedEmail.body).toBe(testEmail.body);
  });
}); 