import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsytpkjrnbbbrzlobnnn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeXRwa2pybmJiYnJ6bG9ibm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAwNDk4NzQsImV4cCI6MTk5NTYyNTg3NH0.pYicUpuCQmHsj6TKv9SpZejxeTyoP6GK5XoYDiXtkbk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

