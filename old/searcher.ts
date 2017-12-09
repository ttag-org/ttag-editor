import * as Fuse from 'fuse.js';
import { Comments } from './parser';

interface Document {
  msgid: string;
  comments?: Comments;
}

export interface Searcher {
  search: (term: string) => Document[];
}

export default function indexDocs(docs: Document[]): Searcher {
  var options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['msgid', 'comments.reference']
  };
  return new Fuse(docs, options);
}
