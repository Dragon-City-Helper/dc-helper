import { UpdateContactData } from '../userService';

export const userApi = {
  // Get user contact information
  async getContact() {
    const response = await fetch('/api/user/contact', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch contact information');
    }

    return response.json();
  },

  // Update user contact information
  async updateContact(contactData: UpdateContactData) {
    const response = await fetch('/api/user/contact', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update contact information');
    }

    return response.json();
  },
};
