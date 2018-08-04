// FROM:
//
// const files = [
//   {
//     path: 'src/components/Foo.json',
//     descriptors: [
//       {
//         id: 'foo_ok',
//         description: 'Ok text',
//         defaultMessage: 'OK',
//       },
//       {
//         id: 'foo_ok',
//         description: 'Submit text',
//         defaultMessage: 'Submit',
//       },
//       {
//         id: 'foo_cancel',
//         description: 'Cancel text',
//         defaultMessage: 'Cancel',
//       },
//     ],
//   },
// ];
//
// TO:
//
// TODO: figure out what message gets returned for duplicate ids
//
// const result = {
//   messages: {
//     foo_ok: 'OK | Submit',
//     foo_cancel: 'Cancel',
//   },
//   duplicateIds: [
//     'foo_ok',
//   ],
// };

export default files => {
  if (!files) throw new Error('Files are required');

  return files.reduce(
    (fileAcc, { descriptors }) => {
      const renameIds = fileAcc.renameIds;
      const duplicateIds = fileAcc.duplicateIds;
      return {
        messages: descriptors.reduce((descAcc, { id, old, defaultMessage }) => {
          if (descAcc[id] !== undefined) {
            duplicateIds.push(id);
          }

          if (old !== undefined) {
            renameIds[id] = old;
          }

          return { ...descAcc, [id]: defaultMessage };
        }, fileAcc.messages),
        renameIds,
        duplicateIds
      };
    },
    {
      messages: {},
      renameIds: {},
      duplicateIds: []
    }
  );
};
