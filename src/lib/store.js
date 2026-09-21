import { supabase } from './supabase'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

