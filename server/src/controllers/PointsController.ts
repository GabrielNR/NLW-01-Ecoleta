import { Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items} = request.query;
    console.log(city, uf, items);

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const seriealizedPoints = points.map(point => {
      return {
         ...point,
         image_url: `http://localhost:3333/uploads/${point.image}`,
      };
    });

    return response.json(seriealizedPoints)

  };

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point) {
      return response.status(400).json({ message: 'point not found'})
    }

    const seriealizedPoint =  {     
      ...point,
      image_url: `http://localhost:3333/uploads/${point.image}`,
    }

    /* 
     * SELECT * FROM items
     * JOIN point_items ON items.id = point_items.item_id
     * WHERE point_items.point_id = {id}
     */

    //relacionamento pra encontrar os itens de coleta
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')
      
      
      return response.json({point: seriealizedPoint, items});
    
  };

  async create(request: Request, response: Response){
    //busca todos os dados no corpo da pagina
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body

    console.log(request.body)

      //qualquer falha nos insert a transaction revertera todas os inserts
    const trx = await knex.transaction();

    //insere no banco de dados
    const point = {
      image: request.file?.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
     }

    const insertedIds = await trx('points').insert(point);
    
    //relacionamento com a tabela de items
    const point_id = insertedIds[0]
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
            item_id,
            point_id,
        }
    })

    await trx('point_items').insert(pointItems);
    
    await trx.commit();
    
    return response.json({
      id: point_id,
      ...point
    })  
  };
  
}

export default PointsController