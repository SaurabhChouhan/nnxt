import {RequiredString, validate, ObjectId} from "./index"
import t from 'tcomb-validation'

export const repositoryAddTaskStruct = t.struct({
    _id: t.Nil,
    name: RequiredString,
    description: RequiredString,
    estimation: t.struct({
        _id: ObjectId
    }),
    feature: t.maybe(t.struct({
        _id: ObjectId
    })),
    createdBy: t.struct({
        _id: ObjectId,
        firstName: RequiredString,
        lastName: t.maybe(RequiredString)
    }),
    technologies: t.maybe(t.list(t.String)),
    tags: t.maybe(t.list(t.String)),
    tasks: t.Nil
})

export const repositorySearchStruct = t.struct({
    _id: t.Nil,

})