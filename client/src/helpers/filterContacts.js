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
    case 'current_job_title':
      return contacts.filter(contact =>
        contact.current_job_title
          .toLowerCase()
          .includes(keyword.trim().toLowerCase())
      );
  }
}
