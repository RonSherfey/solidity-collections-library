const a = require('awaiting');

const bN = web3.toBigNumber;
const ExampleStorage = artifacts.require('./ExampleStorage.sol');

// web3.toAscii results in some padding \u0000 at the end,
// this function fixes this problem
// link to issue: https://github.com/ethereum/web3.js/issues/337
const myToAscii = function (input) { return web3.toAscii(input).replace(/\u0000/g, '') };

contract('BytesIteratorStorage', function (addresses) {
  let exampleStorage;

  beforeEach(async function () {
    exampleStorage = await ExampleStorage.new();
  });

  describe('read_first_from_bytes_dll', function () {
    it('[collection is not empty] returns correct first item', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_first_in_bytes_collection.call()), 'test1');
    });
    it('[collection is empty] returns empty bytes_collection ""', async function () {
      await exampleStorage.remove_all_data_in_bytes_collection();
      assert.deepEqual(myToAscii(await exampleStorage.read_first_in_bytes_collection.call()), '');
    });
  });

  describe('read_last_from_bytes_dll', function () {
    it('[collection is not empty] returns correct last item', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_last_in_bytes_collection.call()), 'test6');
    });
    it('[collection is empty] returns empty bytes_collection ""', async function () {
      await exampleStorage.remove_all_data_in_bytes_collection();
      assert.deepEqual(myToAscii(await exampleStorage.read_first_in_bytes_collection.call()), '');
    });
  });

  describe('read_next_from_bytes_dll', function () {
    it('[item is not last] returns correct next item', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_next_in_bytes_collection.call('test4')), 'test5');
    });
    it('[item is last] returns empty bytes32 ""', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_next_in_bytes_collection.call('test6')), '');
    });
    it('[item does not exist] returns empty bytes32 ""', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_next_in_bytes_collection.call('test_new')), '');
    });
    it('[collection is empty] returns empty bytes32 ""', async function () {
      await exampleStorage.remove_all_data_in_bytes_collection();
      assert.deepEqual(myToAscii(await exampleStorage.read_next_in_bytes_collection.call('test_new')), '');
    });
  });

  describe('read_previous_from_bytes_dll', function () {
    it('[item is not first] returns correct previous item', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_previous_in_bytes_collection.call('test4')), 'test3');
    });
    it('[item is last] returns empty bytes32 ""', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_previous_in_bytes_collection.call('test1')), '');
    });
    it('[item does not exist] returns empty bytes32 ""', async function () {
      assert.deepEqual(myToAscii(await exampleStorage.read_previous_in_bytes_collection.call('test_new')), '');
    });
    it('[collection is empty] returns empty bytes32 ""', async function () {
      await exampleStorage.remove_all_data_in_bytes_collection();
      assert.deepEqual(myToAscii(await exampleStorage.read_previous_in_bytes_collection.call('test_new')), '');
    });
  });

  describe('read_bytes_dll_total', function () {
    it('[collection is not empty] returns correct number of items', async function () {
      assert.deepEqual(await exampleStorage.read_total_in_bytes_collection.call(), bN(6));
    });
    it('[collection is empty] returns 0', async function () {
      await exampleStorage.remove_all_data_in_bytes_collection();
      assert.deepEqual(await exampleStorage.read_total_in_bytes_collection.call(), bN(0));
    });
  });
});
