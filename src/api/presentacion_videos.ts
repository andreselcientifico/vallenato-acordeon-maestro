import { PresentacionVideo } from "@/lib/PresentacionVideos";
import { API_URL } from "@/config/api";

// Get all hero videos
export async function getPresentacionVideos(): Promise<PresentacionVideo[]> {
  try {
    const response = await fetch(`${API_URL}/auth/presentacion-videos`);
    if (!response.ok) {
      console.error("Error fetching hero videos");
      return [];
    }
    const data = await response.json();
    // Map backend response to PresentacionVideo interface
    return data.map((video: any) => ({
      id: video.id,
      title: video.title,
      source: video.source,
      videoId: video.video_id,
      embedUrl: video.embed_url,
      description: video.description,
      createdAt: video.created_at,
      updatedAt: video.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching hero videos:", error);
    return [];
  }
}

// Get hero video by ID
export async function getPresentacionVideoById(id: string): Promise<PresentacionVideo | null> {
  try {
    const response = await fetch(`${API_URL}/api/presentacion-videos/${id}`);
    if (!response.ok) {
      console.error("Error fetching hero video");
      return null;
    }
    const video = await response.json();
    return {
      id: video.id,
      title: video.title,
      date: video.date,
      source: video.source,
      eventType: video.eventType,
      videoUrl: video.video_id,
      embedUrl: video.embed_url,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.created_at,
      updatedAt: video.updated_at,
    };
  } catch (error) {
    console.error("Error fetching hero video:", error);
    return null;
  }
}

// Create hero video (admin only)
export async function createPresentacionVideo(
  title: string,
  source: string,
  videoId: string,
  embedUrl: string,
  description?: string,
  token?: string
): Promise<PresentacionVideo | null> {
  try {
    const response = await fetch(`${API_URL}/api/presentacion-videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        title,
        source,
        video_id: videoId,
        embed_url: embedUrl,
        description,
      }),
    });

    if (!response.ok) {
      console.error("Error creating hero video");
      return null;
    }

    const video = await response.json();
    return {
      id: video.id,
      title: video.title,
      date: video.date,
      source: video.source,
      eventType: video.eventType,
      videoUrl: video.video_id,
      embedUrl: video.embed_url,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.created_at,
      updatedAt: video.updated_at,
    };
  } catch (error) {
    console.error("Error creating hero video:", error);
    return null;
  }
}

// Update hero video (admin only)
export async function updatePresentacionVideo(
  id: string,
  updates: {
    title?: string;
    description?: string;
    embed_url?: string;
  },
  token?: string
): Promise<PresentacionVideo | null> {
  try {
    const response = await fetch(`${API_URL}/api/presentacion-videos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      console.error("Error updating hero video");
      return null;
    }

    const video = await response.json();
    return {
      id: video.id,
      title: video.title,
      date: video.date,
      source: video.source,
      eventType: video.eventType,
      videoUrl: video.video_id,
      embedUrl: video.embed_url,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.created_at,
      updatedAt: video.updated_at,
    };
  } catch (error) {
    console.error("Error updating hero video:", error);
    return null;
  }
}

// Delete hero video (admin only)
export async function deletePresentacionVideo(id: string, token?: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/presentacion-videos/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      console.error("Error deleting hero video");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting hero video:", error);
    return false;
  }
}
