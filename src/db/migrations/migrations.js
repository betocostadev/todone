// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './20260304220410_dear_juggernaut.sql';
import m0001 from './20260317080748_spicy_madame_web.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001
    }
  }
  