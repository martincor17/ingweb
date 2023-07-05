const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

const supabaseUrl = 'https://fsytpkjrnbbbrzlobnnn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeXRwa2pybmJiYnJ6bG9ibm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAwNDk4NzQsImV4cCI6MTk5NTYyNTg3NH0.pYicUpuCQmHsj6TKv9SpZejxeTyoP6GK5XoYDiXtkbk'
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/jugadores', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Jugadores').select('*');
    if (error) {
      throw new Error(error.message);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
