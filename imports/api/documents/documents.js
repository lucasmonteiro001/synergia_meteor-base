import { Mongo } from 'meteor/mongo';

export const Documents = new Mongo.Collection('Documents');

Documents.schema = new SimpleSchema({
    title: {
        type: String,
        label: 'The title of the document.',
    },
});

Documents.attachSchema(Documents.schema);
