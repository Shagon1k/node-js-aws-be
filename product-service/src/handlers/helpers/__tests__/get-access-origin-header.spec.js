import getAccessOriginHeader from '../get-access-origin-header';

describe('getAccessOriginHeader function', () => {
  describe('when correct parameters was passed', () => {
    describe('and requested origin is allowed', () => {
      it('should return passed requested origin', () => {
        const allowedOrigin = 'http://localhost:3000';

        expect(getAccessOriginHeader(allowedOrigin)).toEqual(allowedOrigin);
      });
    });
    describe('and requested origin is NOT allowed', () => {
      it.each(['http://ololo.com', 'http://localhost:3001'])('should return empty string', (blockedOrigin) => {
        expect(getAccessOriginHeader(blockedOrigin)).toEqual('');
      });
    });
  });
});
