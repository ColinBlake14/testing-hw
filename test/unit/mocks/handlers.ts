import { rest } from 'msw';
import { ProductShortInfo } from '../../../src/common/types';

const basename = '/hw/store';

export const handlers = [
  rest.get<ProductShortInfo[]>(`${basename}/api/products`, async (req, res, ctx) => {
    return res(
      ctx.json([{
        id: 10,
        name: "Test Name",
        price: 999,
      },
      {
        id: 11,
        name: "Test Name2",
        price: 1000,
      }])
    )
  }),
]
