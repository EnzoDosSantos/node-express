import { Router } from 'express';
import { jokesController } from '../controllers/jokes.controller';

const router = Router();

router.get('/emparejados', jokesController.getPairedJokes);
router.get('/db', jokesController.getAllJokesFromDb);
router.get('/db/:id', jokesController.getJokeById);
router.get('/usuario/:userName', jokesController.getJokesByUser);
router.get('/categoria/:categoryName', jokesController.getJokesByCategory);
router.get('/usuario/:userName/categoria/:categoryName', jokesController.getJokesByUserAndCategory);
router.get('/:source?', jokesController.getJoke);
router.post('/', jokesController.createJoke);
router.put('/:number', jokesController.updateJoke);
router.delete('/:number', jokesController.deleteJoke);

export default router;
