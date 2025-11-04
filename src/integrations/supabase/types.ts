export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          kind: Database["public"]["Enums"]["document_kind"] | null
          member_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["document_kind"] | null
          member_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["document_kind"] | null
          member_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          banner: string | null
          created_at: string
          cta_link: string | null
          date: string | null
          description: string | null
          end_time: string | null
          id: string
          member_id: string
          name: string | null
          place: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          updated_at: string
        }
        Insert: {
          banner?: string | null
          created_at?: string
          cta_link?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          member_id: string
          name?: string | null
          place?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string
        }
        Update: {
          banner?: string | null
          created_at?: string
          cta_link?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          member_id?: string
          name?: string | null
          place?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          product_id: string
          stock: number
          updated_at: string
        }
        Insert: {
          product_id: string
          stock?: number
          updated_at?: string
        }
        Update: {
          product_id?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      new_artist_details: {
        Row: {
          accepted_terms1: boolean | null
          accepted_terms2: boolean | null
          address1: string | null
          address2: string | null
          artistic_name: string | null
          audio: string | null
          biography1: string | null
          carreira_titulo: string | null
          cell_phone: string | null
          city: string | null
          country_of_birth: string | null
          country_residence: string | null
          created_at: string
          date_of_birth: string | null
          facebook: string | null
          full_name: string | null
          historia_titulo: string | null
          how_is_it_defined: string | null
          how_is_it_defined1: string | null
          id: string
          image1: string | null
          image1_text: string | null
          image10: string | null
          image10_text: string | null
          image11: string | null
          image11_text: string | null
          image12: string | null
          image12_text: string | null
          image2: string | null
          image2_text: string | null
          image3: string | null
          image3_text: string | null
          image4: string | null
          image4_text: string | null
          image5: string | null
          image5_text: string | null
          image6: string | null
          image6_text: string | null
          image7: string | null
          image7_text: string | null
          image8: string | null
          image8_text: string | null
          image9: string | null
          image9_text: string | null
          instagram: string | null
          link_to_video: string | null
          link_to_video10: string | null
          link_to_video2: string | null
          link_to_video3: string | null
          link_to_video4: string | null
          link_to_video5: string | null
          link_to_video6: string | null
          link_to_video7: string | null
          link_to_video8: string | null
          link_to_video9: string | null
          mais_titulo: string | null
          member_id: string
          music_spotify_apple: string | null
          perfil_completo: boolean | null
          postal_code: string | null
          profile_image: string | null
          profile_text2: string | null
          updated_at: string
          video_banner_landscape: string | null
          video_banner_portrait: string | null
          visao_geral_titulo: string | null
          website: string | null
          youtube_channel: string | null
        }
        Insert: {
          accepted_terms1?: boolean | null
          accepted_terms2?: boolean | null
          address1?: string | null
          address2?: string | null
          artistic_name?: string | null
          audio?: string | null
          biography1?: string | null
          carreira_titulo?: string | null
          cell_phone?: string | null
          city?: string | null
          country_of_birth?: string | null
          country_residence?: string | null
          created_at?: string
          date_of_birth?: string | null
          facebook?: string | null
          full_name?: string | null
          historia_titulo?: string | null
          how_is_it_defined?: string | null
          how_is_it_defined1?: string | null
          id?: string
          image1?: string | null
          image1_text?: string | null
          image10?: string | null
          image10_text?: string | null
          image11?: string | null
          image11_text?: string | null
          image12?: string | null
          image12_text?: string | null
          image2?: string | null
          image2_text?: string | null
          image3?: string | null
          image3_text?: string | null
          image4?: string | null
          image4_text?: string | null
          image5?: string | null
          image5_text?: string | null
          image6?: string | null
          image6_text?: string | null
          image7?: string | null
          image7_text?: string | null
          image8?: string | null
          image8_text?: string | null
          image9?: string | null
          image9_text?: string | null
          instagram?: string | null
          link_to_video?: string | null
          link_to_video10?: string | null
          link_to_video2?: string | null
          link_to_video3?: string | null
          link_to_video4?: string | null
          link_to_video5?: string | null
          link_to_video6?: string | null
          link_to_video7?: string | null
          link_to_video8?: string | null
          link_to_video9?: string | null
          mais_titulo?: string | null
          member_id: string
          music_spotify_apple?: string | null
          perfil_completo?: boolean | null
          postal_code?: string | null
          profile_image?: string | null
          profile_text2?: string | null
          updated_at?: string
          video_banner_landscape?: string | null
          video_banner_portrait?: string | null
          visao_geral_titulo?: string | null
          website?: string | null
          youtube_channel?: string | null
        }
        Update: {
          accepted_terms1?: boolean | null
          accepted_terms2?: boolean | null
          address1?: string | null
          address2?: string | null
          artistic_name?: string | null
          audio?: string | null
          biography1?: string | null
          carreira_titulo?: string | null
          cell_phone?: string | null
          city?: string | null
          country_of_birth?: string | null
          country_residence?: string | null
          created_at?: string
          date_of_birth?: string | null
          facebook?: string | null
          full_name?: string | null
          historia_titulo?: string | null
          how_is_it_defined?: string | null
          how_is_it_defined1?: string | null
          id?: string
          image1?: string | null
          image1_text?: string | null
          image10?: string | null
          image10_text?: string | null
          image11?: string | null
          image11_text?: string | null
          image12?: string | null
          image12_text?: string | null
          image2?: string | null
          image2_text?: string | null
          image3?: string | null
          image3_text?: string | null
          image4?: string | null
          image4_text?: string | null
          image5?: string | null
          image5_text?: string | null
          image6?: string | null
          image6_text?: string | null
          image7?: string | null
          image7_text?: string | null
          image8?: string | null
          image8_text?: string | null
          image9?: string | null
          image9_text?: string | null
          instagram?: string | null
          link_to_video?: string | null
          link_to_video10?: string | null
          link_to_video2?: string | null
          link_to_video3?: string | null
          link_to_video4?: string | null
          link_to_video5?: string | null
          link_to_video6?: string | null
          link_to_video7?: string | null
          link_to_video8?: string | null
          link_to_video9?: string | null
          mais_titulo?: string | null
          member_id?: string
          music_spotify_apple?: string | null
          perfil_completo?: boolean | null
          postal_code?: string | null
          profile_image?: string | null
          profile_text2?: string | null
          updated_at?: string
          video_banner_landscape?: string | null
          video_banner_portrait?: string | null
          visao_geral_titulo?: string | null
          website?: string | null
          youtube_channel?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          order_id: string
          price_cents: number
          product_id: string
          qty: number
        }
        Insert: {
          order_id: string
          price_cents: number
          product_id: string
          qty: number
        }
        Update: {
          order_id?: string
          price_cents?: number
          product_id?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          id: string
          status: string
          total_cents: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          status?: string
          total_cents?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          status?: string
          total_cents?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_prices: {
        Row: {
          amount_cents: number
          currency: string
          product_id: string
          segment: string
        }
        Insert: {
          amount_cents: number
          currency?: string
          product_id: string
          segment: string
        }
        Update: {
          amount_cents?: number
          currency?: string
          product_id?: string
          segment?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          gallery_urls: Json | null
          id: string
          name: string
          slug: string
          updated_at: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          gallery_urls?: Json | null
          id?: string
          name: string
          slug: string
          updated_at?: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          gallery_urls?: Json | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      professional_verifications: {
        Row: {
          attachment_urls: Json | null
          company: string | null
          created_at: string
          id: string
          legal_id: string | null
          notes: string | null
          portfolio_url: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          attachment_urls?: Json | null
          company?: string | null
          created_at?: string
          id?: string
          legal_id?: string | null
          notes?: string | null
          portfolio_url?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          attachment_urls?: Json | null
          company?: string | null
          created_at?: string
          id?: string
          legal_id?: string | null
          notes?: string | null
          portfolio_url?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          about: string | null
          banner_image: string | null
          block1_image: string | null
          block1_title: string | null
          block2_image: string | null
          block2_title: string | null
          block3_image: string | null
          block3_title: string | null
          block4_image: string | null
          block4_title: string | null
          block5_image: string | null
          block5_title: string | null
          cover_image: string | null
          created_at: string
          id: string
          member_id: string
          partners: string | null
          project_sheet: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          team_art: string | null
          team_tech: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          about?: string | null
          banner_image?: string | null
          block1_image?: string | null
          block1_title?: string | null
          block2_image?: string | null
          block2_title?: string | null
          block3_image?: string | null
          block3_title?: string | null
          block4_image?: string | null
          block4_title?: string | null
          block5_image?: string | null
          block5_title?: string | null
          cover_image?: string | null
          created_at?: string
          id?: string
          member_id: string
          partners?: string | null
          project_sheet?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          team_art?: string | null
          team_tech?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          about?: string | null
          banner_image?: string | null
          block1_image?: string | null
          block1_title?: string | null
          block2_image?: string | null
          block2_title?: string | null
          block3_image?: string | null
          block3_title?: string | null
          block4_image?: string | null
          block4_title?: string | null
          block5_image?: string | null
          block5_title?: string | null
          cover_image?: string | null
          created_at?: string
          id?: string
          member_id?: string
          partners?: string | null
          project_sheet?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          team_art?: string | null
          team_tech?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          member_id: string
          message: string
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          message: string
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          message?: string
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      artist_details_public: {
        Row: {
          artistic_name: string | null
          audio: string | null
          biography1: string | null
          carreira_titulo: string | null
          city: string | null
          country_of_birth: string | null
          country_residence: string | null
          created_at: string | null
          facebook: string | null
          full_name: string | null
          historia_titulo: string | null
          id: string | null
          image1: string | null
          image1_text: string | null
          image10: string | null
          image10_text: string | null
          image11: string | null
          image11_text: string | null
          image12: string | null
          image12_text: string | null
          image2: string | null
          image2_text: string | null
          image3: string | null
          image3_text: string | null
          image4: string | null
          image4_text: string | null
          image5: string | null
          image5_text: string | null
          image6: string | null
          image6_text: string | null
          image7: string | null
          image7_text: string | null
          image8: string | null
          image8_text: string | null
          image9: string | null
          image9_text: string | null
          instagram: string | null
          link_to_video: string | null
          link_to_video10: string | null
          link_to_video2: string | null
          link_to_video3: string | null
          link_to_video4: string | null
          link_to_video5: string | null
          link_to_video6: string | null
          link_to_video7: string | null
          link_to_video8: string | null
          link_to_video9: string | null
          mais_titulo: string | null
          member_id: string | null
          music_spotify_apple: string | null
          profile_image: string | null
          profile_text2: string | null
          slug: string | null
          video_banner_landscape: string | null
          video_banner_portrait: string | null
          visao_geral_titulo: string | null
          website: string | null
          youtube_channel: string | null
        }
        Insert: {
          artistic_name?: string | null
          audio?: string | null
          biography1?: string | null
          carreira_titulo?: string | null
          city?: string | null
          country_of_birth?: string | null
          country_residence?: string | null
          created_at?: string | null
          facebook?: string | null
          full_name?: string | null
          historia_titulo?: string | null
          id?: string | null
          image1?: string | null
          image1_text?: string | null
          image10?: string | null
          image10_text?: string | null
          image11?: string | null
          image11_text?: string | null
          image12?: string | null
          image12_text?: string | null
          image2?: string | null
          image2_text?: string | null
          image3?: string | null
          image3_text?: string | null
          image4?: string | null
          image4_text?: string | null
          image5?: string | null
          image5_text?: string | null
          image6?: string | null
          image6_text?: string | null
          image7?: string | null
          image7_text?: string | null
          image8?: string | null
          image8_text?: string | null
          image9?: string | null
          image9_text?: string | null
          instagram?: string | null
          link_to_video?: string | null
          link_to_video10?: string | null
          link_to_video2?: string | null
          link_to_video3?: string | null
          link_to_video4?: string | null
          link_to_video5?: string | null
          link_to_video6?: string | null
          link_to_video7?: string | null
          link_to_video8?: string | null
          link_to_video9?: string | null
          mais_titulo?: string | null
          member_id?: string | null
          music_spotify_apple?: string | null
          profile_image?: string | null
          profile_text2?: string | null
          slug?: string | null
          video_banner_landscape?: string | null
          video_banner_portrait?: string | null
          visao_geral_titulo?: string | null
          website?: string | null
          youtube_channel?: string | null
        }
        Update: {
          artistic_name?: string | null
          audio?: string | null
          biography1?: string | null
          carreira_titulo?: string | null
          city?: string | null
          country_of_birth?: string | null
          country_residence?: string | null
          created_at?: string | null
          facebook?: string | null
          full_name?: string | null
          historia_titulo?: string | null
          id?: string | null
          image1?: string | null
          image1_text?: string | null
          image10?: string | null
          image10_text?: string | null
          image11?: string | null
          image11_text?: string | null
          image12?: string | null
          image12_text?: string | null
          image2?: string | null
          image2_text?: string | null
          image3?: string | null
          image3_text?: string | null
          image4?: string | null
          image4_text?: string | null
          image5?: string | null
          image5_text?: string | null
          image6?: string | null
          image6_text?: string | null
          image7?: string | null
          image7_text?: string | null
          image8?: string | null
          image8_text?: string | null
          image9?: string | null
          image9_text?: string | null
          instagram?: string | null
          link_to_video?: string | null
          link_to_video10?: string | null
          link_to_video2?: string | null
          link_to_video3?: string | null
          link_to_video4?: string | null
          link_to_video5?: string | null
          link_to_video6?: string | null
          link_to_video7?: string | null
          link_to_video8?: string | null
          link_to_video9?: string | null
          mais_titulo?: string | null
          member_id?: string | null
          music_spotify_apple?: string | null
          profile_image?: string | null
          profile_text2?: string | null
          slug?: string | null
          video_banner_landscape?: string | null
          video_banner_portrait?: string | null
          visao_geral_titulo?: string | null
          website?: string | null
          youtube_channel?: string | null
        }
        Relationships: []
      }
      artists_public: {
        Row: {
          country_residence: string | null
          created_at: string | null
          display_name: string | null
          frase_de_impacto: string | null
          id: string | null
          member_id: string | null
          profile_image: string | null
          slug: string | null
        }
        Insert: {
          country_residence?: string | null
          created_at?: string | null
          display_name?: string | null
          frase_de_impacto?: string | null
          id?: string | null
          member_id?: string | null
          profile_image?: string | null
          slug?: string | null
        }
        Update: {
          country_residence?: string | null
          created_at?: string | null
          display_name?: string | null
          frase_de_impacto?: string | null
          id?: string | null
          member_id?: string | null
          profile_image?: string | null
          slug?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member" | "professional"
      content_status: "draft" | "published"
      document_kind: "contrato" | "termo" | "outro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member", "professional"],
      content_status: ["draft", "published"],
      document_kind: ["contrato", "termo", "outro"],
    },
  },
} as const
