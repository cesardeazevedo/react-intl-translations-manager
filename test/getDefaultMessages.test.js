import getDefaultMessages from '../src/getDefaultMessages';
import getLanguageReport, { getCleanReport } from '../src/getLanguageReport';

describe('getDefaultMessages', () => {
  it('should throw an error if no files are passed', () => {
    const files = undefined;
    expect(() => getDefaultMessages(files)).toThrow(Error);
  });

  it('should give back all default messages', () => {
    const result = getDefaultMessages([
      {
        path: 'src/components/Button.json',
        descriptors: [
          {
            id: 'button_text',
            defaultMessage: 'Submit'
          },
          {
            id: 'button_title',
            defaultMessage: 'Click this button'
          }
        ]
      }
    ]);

    const expected = {
      renameIds: {},
      duplicateIds: [],
      messages: {
        button_text: 'Submit',
        button_title: 'Click this button'
      }
    };

    expect(result).toEqual(expected);
  });

  it('should give back all default messages, and all duplicate keys', () => {
    const result = getDefaultMessages([
      {
        path: 'src/components/Button.json',
        descriptors: [
          {
            id: 'button_text',
            defaultMessage: 'Submit'
          },
          {
            id: 'button_title',
            defaultMessage: 'Click this button'
          }
        ]
      },
      {
        path: 'src/components/AnotherButton.json',
        descriptors: [
          {
            id: 'button_text',
            defaultMessage: 'Cancel'
          },
          {
            id: 'button_title',
            defaultMessage: 'Click this button to cancel'
          }
        ]
      }
    ]);

    const expected = {
      renameIds: {},
      duplicateIds: ['button_text', 'button_title'],
      messages: {
        button_text: 'Cancel',
        button_title: 'Click this button to cancel'
      }
    };

    expect(result).toEqual(expected);
  });
  test('Should rename a key and keep translation', () => {
    const result = getDefaultMessages([
      {
        path: 'src/components/Button.json',
        descriptors: [
          {
            id: 'btn',
            old: 'button_title',
            defaultMessage: 'Click this button'
          }
        ]
      },
    ]);

    const actual = getLanguageReport(
      result.messages,
      {
        button_title: 'Klik op deze knop',
      },
      [],
      result.renameIds,
    );

    expect(actual.added).toEqual([]);
    expect(actual.deleted).toEqual([]);
    expect(actual.renamed).toEqual([{ key: 'btn', from: 'button_title', message: 'Klik op deze knop' }]);
    expect(result.renameIds).toEqual({ btn: 'button_title' });
    expect(actual.fileOutput).toEqual({ btn: 'Klik op deze knop' });
  })
  test('Should keep the translation when after renamed', () => {
    const result = getDefaultMessages([
      {
        path: 'src/components/Button.json',
        descriptors: [
          {
            id: 'btn',
            old: 'button_title',
            defaultMessage: 'Click this button'
          }
        ]
      },
    ]);

    const actual = getLanguageReport(
      result.messages,
      {
        btn: 'Klik op deze knop'
      },
      [],
      result.renameIds,
    );

    expect(actual.added).toEqual([]);
    expect(actual.deleted).toEqual([]);
    expect(actual.renamed).toEqual([]);
    expect(result.renameIds).toEqual({ btn: 'button_title' });
    expect(actual.fileOutput).toEqual({ btn: 'Klik op deze knop' });
  })
});
