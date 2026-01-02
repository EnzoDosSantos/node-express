import { query, closePool } from './connection';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const users = ['Manolito', 'Pepe', 'Isabel', 'Pedro'];

const categories = [
  { name: 'humor negro', id: 1 },
  { name: 'humor amarillo', id: 2 },
  { name: 'chistes verdes', id: 3 },
];

const jokesByCategory: Record<string, string[]> = {
  'humor negro': [
    '¿Cuál es la diferencia entre un ascensor y una persona muerta? El ascensor sube y baja.',
    'Mi abuelo decía que hay que ver el vaso medio lleno. Por eso murió de deshidratación.',
    '¿Por qué los cementerios tienen rejas? Porque la gente se muere por entrar.',
    'El doctor me dijo que me quedaban 6 meses de vida. Le dije que no podía pagar. Me dio 6 meses más.',
    '¿Qué le dice un forense a otro? ¿Quedamos en el bar o te abro aquí?',
    'Mi ex murió ahogada. Todavía me acuerdo de su cara... cada vez que miro la pecera.',
    'El dentista me dijo: Esto no te va a doler nada. Y tenía razón, a él no le dolió.',
    'Siempre quise morir durmiendo como mi abuelo, no gritando como los pasajeros del bus.',
    '¿Sabías que el 40% de las muertes en casa son por accidentes domésticos? El otro 60% fueron a propósito.',
    '¿Qué hace una persona ciega con una sierra? Lee.',
    'Doctor, tengo amnesia. ¿Desde cuándo? ¿Desde cuándo qué?',
    '¿Por qué los ataúdes tienen clavos? Para que los muertos no salgan corriendo de la factura.',
  ],
  'humor amarillo': [
    '¿Qué le dice un techo a otro techo? Techo de menos.',
    '¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.',
    '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
    '¿Cómo se dice pañuelo en japonés? Saka-moko.',
    '¿Qué le dice una iguana a su hermana gemela? ¡Iguanita!',
    '¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.',
    '¿Qué le dice el cero al ocho? ¡Bonito cinturón!',
    '¿Cómo se llama el campeón de buceo japonés? Tokofondo.',
    '¿Qué le dice una pared a otra? Nos vemos en la esquina.',
    '¿Qué hace un perro con un taladro? ¡Taladrando!',
    '¿Por qué el tomate no puede cerrar la puerta? Porque es un tomate de bote.',
    '¿Qué le dice el 1 al 10? Para ser como yo, tienes que ser sincero.',
  ],
  'chistes verdes': [
    '¿Cuál es el animal más antiguo? La cebra, porque está en blanco y negro.',
    '¿Qué le dice el semáforo al coche? No me mires, me estoy cambiando.',
    '¿Cuál es el colmo de un electricista? Que su esposa se llame Luz y los hijos le sigan la corriente.',
    '¿Por qué las jirafas tienen el cuello tan largo? Porque tienen los pies que huelen fatal.',
    '¿Qué le dice un pollito a otro? Mira cómo me pica el huevo.',
    '¿Cuál es el colmo de Aladdín? Tener un genio y estudiar para los exámenes.',
    '¿Qué hace una vaca mirando al cielo? Una vaca pensativa, y dos? Una película bovina.',
    '¿Por qué los elefantes no usan computadora? Porque le tienen miedo al ratón.',
    '¿Cómo se dice suegra en chino? Kin-Yo-Te-Puá.',
    '¿Cuál es el colmo de un jardinero? Que su novia se llame Rosa y lo deje plantado.',
    '¿Qué le dice Batman a Robin antes de subir al auto? Sube Robin.',
    '¿Por qué los pájaros vuelan hacia el sur? Porque caminando tardarían mucho.',
  ],
};

async function seed() {
  logger.info('Iniciando seed de base de datos...');

  try {
    await query('DELETE FROM jokes');
    await query('DELETE FROM categories');
    await query('DELETE FROM users');
    logger.info('Tablas limpiadas');

    await query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE jokes_id_seq RESTART WITH 1');

    for (const userName of users) {
      await query('INSERT INTO users (name) VALUES ($1)', [userName]);
    }
    logger.info(`✅ ${users.length} usuarios creados: ${users.join(', ')}`);

    for (const category of categories) {
      await query('INSERT INTO categories (name) VALUES ($1)', [category.name]);
    }
    logger.info(`✅ ${categories.length} categorías creadas: ${categories.map(c => c.name).join(', ')}`);

    let jokeCount = 0;
    const usersResult = await query<{ id: number; name: string }>('SELECT id, name FROM users');
    const categoriesResult = await query<{ id: number; name: string }>('SELECT id, name FROM categories');

    for (const user of usersResult) {
      for (const category of categoriesResult) {
        const categoryJokes = jokesByCategory[category.name] || [];
        const startIndex = (user.id - 1) * 3 % categoryJokes.length;
        const selectedJokes = categoryJokes.slice(startIndex, startIndex + 3);

        for (const jokeText of selectedJokes) {
          await query(
            'INSERT INTO jokes (text, user_id, category_id) VALUES ($1, $2, $3)',
            [jokeText, user.id, category.id]
          );
          jokeCount++;
        }
      }
    }
    logger.info(`✅ ${jokeCount} chistes creados (3 por temática por usuario)`);

    logger.info('\n📊 Estadísticas de la base de datos:');
    
    const totalUsers = await query<{ count: string }>('SELECT COUNT(*) as count FROM users');
    logger.info(`   - Usuarios: ${totalUsers[0].count}`);
    
    const totalCategories = await query<{ count: string }>('SELECT COUNT(*) as count FROM categories');
    logger.info(`   - Categorías: ${totalCategories[0].count}`);
    
    const totalJokes = await query<{ count: string }>('SELECT COUNT(*) as count FROM jokes');
    logger.info(`   - Chistes: ${totalJokes[0].count}`);

    logger.info('\n✅ Seed completado exitosamente');
  } catch (error) {
    logger.error('❌ Error durante el seed', error);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seed;

