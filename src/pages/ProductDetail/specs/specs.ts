import stormBee from './stormBee.json';
import lightBee from './lightBee.json';
import hyperBee from './hyperBee.json';
import ultraBee from './ultraBee.json';
import snowbikeLight from './snowbikeLight.json';

export const specs: Record<string, typeof stormBee> = {
  '80bb22b4-2710-4c3c-ad5d-b1819c08db80': hyperBee, // SUR-RON Hyper Bee
  '7c2d3ce5-988c-4b57-9a92-58dbfad661d9': lightBee, // SUR-RON Light Bee 2025
  '6ff5dbdb-37ee-4f7a-9831-d0fd34949727': ultraBee, // SUR-RON Ultra 2025
  'd0bdaeef-71a9-4a8b-a8e9-f750ba86be9b': lightBee, // SUR-RON Light Bee X
  'adf6391b-03a2-4e0a-8a31-8666e8e6c449': ultraBee, // SUR-RON Ultra Bee
  'a74f5db2-c7eb-4c38-a137-66e377c8232a': stormBee, // SUR-RON Storm Bee
  '05433bc8-5c2f-4150-843e-de4ba12e1ce8': lightBee, // SUR-RON L1E Light bee
  'ced97c28-77b7-49d5-8a11-bb80c9a2cd41': lightBee, // SUR-RON Light Bee S
  '792f03dc-b200-4c59-ac65-1bd9cf55729b': snowbikeLight, // гусеничные комплекты
};
