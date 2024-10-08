export interface EventFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalGuests: number;
  images: string[];
}

export interface Event extends EventFormData {
  id: number;
}

interface FetchEventsParams {
  page: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
  filterName?: string;
  filterStartDate?: string;
  filterEndDate?: string;
}

const API_URL = import.meta.env.VITE_BASE_URL;

export const getEvents = async ({
  page,
  limit,
  sortBy,
  order,
  filterName,
  filterStartDate,
  filterEndDate,
}: FetchEventsParams): Promise<{ rows:[], count: number }> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    order,
    ...(filterName && { filterName }),
    ...(filterStartDate && { filterStartDate }),
    ...(filterEndDate && { filterEndDate }),
  });

  const response = await fetch(`${API_URL}/events?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const createEvent = async (
  event: Omit<Event, "id">,
  images: File[]
): Promise<Event> => {
  const formData = new FormData();
  formData.append("name", event.name);
  formData.append("description", event.description);
  formData.append("startDate", event.startDate);
  formData.append("endDate", event.endDate);
  formData.append("totalGuests", event.totalGuests.toString());

  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
};

export const updateEvent = async (
  event: Event,
  images: File[]
): Promise<Event> => {
  const formData = new FormData();
  formData.append("name", event.name);
  formData.append("description", event.description);
  formData.append("startDate", event.startDate);
  formData.append("endDate", event.endDate);
  formData.append("totalGuests", event.totalGuests.toString());

  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await fetch(`${API_URL}/events/${event.id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return response.json();
};

export const deleteEvent = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
};
