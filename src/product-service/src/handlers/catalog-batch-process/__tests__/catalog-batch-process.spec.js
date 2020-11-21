import catalogBatchProcess from '../catalog-batch-process';
import { addProductToDB } from '@database-controllers';
import AWS from 'aws-sdk-mock';

jest.mock('@database-controllers');

const validProducts = [
	{ title: 'Title1', description: 'Description1', imageurl: 'Image1', price: 300, count: 4 },
	{ title: 'Title2', description: 'Description2', imageurl: 'Image2', price: 200, count: 5 },
];

const validAndInvalidProducts = [
	{ wrongProperty: 'Title1', description: 'Description1', imageurl: 'Image1', price: 'Price1', count: 4 },
	{ title: 'Title1', description: 'Description1', imageurl: 'Image1', price: 200, count: 4 },
	{ wrongProperty: 'Title2', description: 'Description2', imageurl: 'Image2', price: 'Price2', count: 5 },
];

let mockedSNSPublish;
let mockedSQSDelete;

describe('catalogBatchProcess function', () => {
	beforeAll(() => {
		addProductToDB.mockImplementation((data) => data);
    mockedSNSPublish = jest.fn();
    mockedSQSDelete = jest.fn();
		AWS.mock('SNS', 'publish', (params, callback) => {
      mockedSNSPublish();
      callback(null, 'test');
    });
  });

	afterAll(() => {
		AWS.restore('S3');
  });

	describe('when some records recieved', () => {
		describe('and all recieved records collect valid product data', () => {
			const mockedRecords = validProducts.map((el) => ({
				receiptHandle: 'mockedReceipt',
				body: JSON.stringify(el),
			}));
			const mockedEvent = {
				Records: mockedRecords,
      };

			beforeAll(async (done) => {
				await catalogBatchProcess(mockedEvent);
				done();
      });

			it('should add all products to DB', () => {
				expect(addProductToDB).toHaveBeenCalledWith(validProducts[0]);
				expect(addProductToDB).toHaveBeenCalledWith(validProducts[1]);
				expect(addProductToDB).toHaveBeenCalledTimes(2);
      });

			it('should publish SNS message for each product', () => {
				expect(mockedSNSPublish).toHaveBeenCalledTimes(2);
			});
    });

		describe('and some recieved records collect invalid product data', () => {
			const mockedRecords = validAndInvalidProducts.map((el) => ({
				receiptHandle: 'mockedReceipt',
				body: JSON.stringify(el),
			}));
			const mockedEvent = {
				Records: mockedRecords,
      };

			beforeAll(async (done) => {
				addProductToDB.mockClear();
				mockedSNSPublish.mockClear();
				await catalogBatchProcess(mockedEvent);
				done();
      });

			it('should add only valid products to DB', () => {
				expect(addProductToDB).toHaveBeenCalledWith(validAndInvalidProducts[1]);
				expect(addProductToDB).toHaveBeenCalledTimes(1);
      });

			it('should publish SNS message for each valid product', () => {
				expect(mockedSNSPublish).toHaveBeenCalledTimes(1);
      });
		});
	});
});
