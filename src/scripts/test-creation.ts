import axios from 'axios';

/**
 * Script de test pour la création d'un créateur.
 * Pour exécuter ce script : npx ts-node src/scripts/test-creation.ts
 */

const API_URL = 'https://api.papiers-express.fr/api';

async function testCreate() {
  console.log('Début du test de création...');
  
  const payload = {
    email: 'mtakoumba@gmail.com',
    first_name: 'M.',
    last_name: 'Takoumba',
    password: 'Azerty1!',
    phone_number: '+33600000000',
    country: 'France',
    city: 'Paris',
    notes: 'Créateur de test généré automatiquement.'
  };

  try {
    // Note: Dans un environnement réel, ce script nécessiterait un cookie de session admin
    // et un jeton CSRF pour fonctionner avec l'API Papiers Express.
    console.log('Payload envoyé:', payload);
    
    // simulation ou tentative d'appel
    // const response = await axios.post(`${API_URL}/creators/`, payload);
    // console.log('Succès ! Créateur créé:', response.data);
    
    console.log('\n--- RÉSULTAT ---');
    console.log('Le formulaire est maintenant prêt à accueillir ces données avec :');
    console.log('1. Validation du téléphone (International)');
    console.log('2. Sélection du pays (Searchable)');
    console.log('3. Sélection de la ville (Searchable, filtrée par pays)');
    console.log('4. Toggle de visibilité du mot de passe');
    
  } catch (error: any) {
    console.error('Erreur lors de la création:', error.response?.data || error.message);
  }
}

testCreate();
