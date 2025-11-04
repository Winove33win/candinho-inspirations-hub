export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "member" | "artist" | "professional" | "admin";
          created_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "member" | "artist" | "professional" | "admin";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "member" | "artist" | "professional" | "admin";
          created_at?: string | null;
        };
        Relationships: [];
      };
      artists: {
        Row: {
          id: string;
          user_id: string;
          stage_name: string | null;
          country: string | null;
          city: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          stage_name?: string | null;
          country?: string | null;
          city?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          stage_name?: string | null;
          country?: string | null;
          city?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "artists_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
      professional_verifications: {
        Row: {
          id: string;
          user_id: string;
          legal_id: string | null;
          company: string | null;
          website: string | null;
          portfolio_url: string | null;
          attachment_urls: Json | null;
          status: "pending" | "approved" | "rejected";
          reviewer_id: string | null;
          reviewed_at: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          legal_id?: string | null;
          company?: string | null;
          website?: string | null;
          portfolio_url?: string | null;
          attachment_urls?: Json | null;
          status?: "pending" | "approved" | "rejected";
          reviewer_id?: string | null;
          reviewed_at?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          legal_id?: string | null;
          company?: string | null;
          website?: string | null;
          portfolio_url?: string | null;
          attachment_urls?: Json | null;
          status?: "pending" | "approved" | "rejected";
          reviewer_id?: string | null;
          reviewed_at?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "professional_verifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "professional_verifications_reviewer_id_fkey";
            columns: ["reviewer_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
      blog_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_url: string | null;
          author_id: string | null;
          published: boolean | null;
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          author_id?: string | null;
          published?: boolean | null;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          author_id?: string | null;
          published?: boolean | null;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
      blog_post_categories: {
        Row: {
          post_id: string;
          category_id: string;
        };
        Insert: {
          post_id: string;
          category_id: string;
        };
        Update: {
          post_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "blog_post_categories_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          gallery_urls: Json | null;
          visible: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          gallery_urls?: Json | null;
          visible?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          gallery_urls?: Json | null;
          visible?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      product_prices: {
        Row: {
          product_id: string;
          segment: "professional";
          currency: string;
          amount_cents: number;
        };
        Insert: {
          product_id: string;
          segment?: "professional";
          currency?: string;
          amount_cents: number;
        };
        Update: {
          product_id?: string;
          segment?: "professional";
          currency?: string;
          amount_cents?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_prices_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
      inventory: {
        Row: {
          product_id: string;
          stock: number;
        };
        Insert: {
          product_id: string;
          stock?: number;
        };
        Update: {
          product_id?: string;
          stock?: number;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: true;
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "paid" | "canceled" | "fulfilled";
          currency: string;
          total_cents: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "paid" | "canceled" | "fulfilled";
          currency?: string;
          total_cents?: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "pending" | "paid" | "canceled" | "fulfilled";
          currency?: string;
          total_cents?: number;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
      order_items: {
        Row: {
          order_id: string;
          product_id: string;
          qty: number;
          price_cents: number;
        };
        Insert: {
          order_id: string;
          product_id: string;
          qty: number;
          price_cents: number;
        };
        Update: {
          order_id?: string;
          product_id?: string;
          qty?: number;
          price_cents?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
    };
    Views: {
      v_products_for_user: {
        Row: {
          id: string | null;
          slug: string | null;
          name: string | null;
          description: string | null;
          gallery_urls: Json | null;
          visible: boolean | null;
          created_at: string | null;
          professional_price_cents: number | null;
          professional_price_currency: string | null;
        };
      };
    };
    Functions: {
      admin_approve_verification: {
        Args: {
          p_verification_id: string;
          p_notes?: string | null;
        };
        Returns: Database["public"]["Tables"]["professional_verifications"]["Row"];
      };
      admin_reject_verification: {
        Args: {
          p_verification_id: string;
          p_notes?: string | null;
        };
        Returns: Database["public"]["Tables"]["professional_verifications"]["Row"];
      };
      create_order: {
        Args: {
          p_items: Json;
          p_currency?: string;
        };
        Returns: string;
      };
      get_product_with_price: {
        Args: {
          p_product_slug: string;
          p_user_id?: string;
        };
        Returns: {
          id: string | null;
          slug: string | null;
          name: string | null;
          description: string | null;
          gallery_urls: Json | null;
          visible: boolean | null;
          created_at: string | null;
          professional_price_cents: number | null;
          professional_price_currency: string | null;
        }[];
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
};
