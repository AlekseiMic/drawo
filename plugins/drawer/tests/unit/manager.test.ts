import assert from 'assert';
import { Manager } from '../../';
import 'mocha';

describe('Manager', function () {
  describe('Initializes', function () {
    const m = new Manager({ name: 'test', id: 'test' });
    let serializedData: ReturnType<typeof m.serialize>;
    m.init();

    it('-> with correct data', function () {
      assert.equal(m.user.id, 'test');
      assert.equal(m.user.name, 'test');
    });

    it('-> empty', function () {
      serializedData = m.serialize();
      assert.deepStrictEqual(serializedData, {
        users: [],
        layers: { layers: {}, scratchesPerLayer: {} },
        scratches: [],
        actions: { internal: [], external: [] },
        settings: {},
      });
      assert.equal(m.users.users.length, 0);
    });
  });

  describe('Serializes/Deserializes', function () {
    const m = new Manager({ name: 'test', id: 'test' });
    m.init();
    const predefinedData: ReturnType<typeof m.serialize> = {
      users: [{ id: 'user123', name: 'User 123', isObserver: true, center: { x: 1000, y: 500 } }],
      layers: { layers: {}, scratchesPerLayer: {} },
      scratches: [],
      actions: { internal: [], external: [] },
      settings: {},
    };

    it('-> deserializes', function () {
      m.deserialize(predefinedData);
      assert.equal(m.users.users.length, 1);
      assert.equal(m.users.getById('user123')?.name, 'User 123');
    });

    it('-> serializes', function() {
      const serializedData = m.serialize();
      assert.deepEqual(serializedData, predefinedData);
    });
  });
});
