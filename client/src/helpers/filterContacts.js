export default function filterContacts(type, contacts, keyword) {
  switch (type) {
    case 'company':
      return contacts.filter(contact =>
        contact.company.toLowerCase().includes(keyword.trim().toLowerCase())
      );
    case 'location':
      return contacts.filter(contact =>
        contact.location.toLowerCase().includes(keyword.trim().toLowerCase())
      );
    case 'name':
      return contacts.filter(
        contact =>
          contact.first_name
            .toLowerCase()
            .includes(keyword.trim().toLowerCase()) ||
          contact.last_name.toLowerCase().includes(keyword.trim().toLowerCase())
      );
  }
}
