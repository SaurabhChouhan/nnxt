import * as AC from "../actions/actionConsts"


let initialState = {
    all: [  {
        "_id": "5ad07a4bbd999a1230f38659",
        "name": "v 2.0",
        "status": "plan-requested",
        "updated": "2018-04-13T09:35:32.808Z",
        "created": "2018-04-13T09:35:32.808Z",
        "additional": {
            "plannedHoursReportedTasks": 0,
            "estimatedHoursCompletedTasks": 0,
            "estimatedHoursPlannedTasks": 0,
            "reportedHours": 0,
            "plannedHours": 0,
            "estimatedHours": 0,
            "billedHours": 0
        },
        "initial": {
            "clientReleaseDate": "2018-05-11T09:36:42.741Z",
            "devStartDate": "2018-04-20T09:36:36.566Z",
            "devEndDate": "2018-05-11T09:36:39.389Z",
            "plannedHoursReportedTasks": 0,
            "estimatedHoursCompletedTasks": 0,
            "estimatedHoursPlannedTasks": 0,
            "reportedHours": 0,
            "plannedHours": 0,
            "estimatedHours": 0,
            "billedHours": 200
        },
        "team": [
            {
                "_id": "5ad079c9f641c71b6827ea65",
                "email": "developer1@test.com",
                "name": "Developer-1One"
            },
            {
                "_id": "5ad079c9f641c71b6827ea66",
                "email": "developer2@test.com",
                "name": "Developer-2Two"
            },
            {
                "_id": "5ad079c9f641c71b6827ea67",
                "email": "developer3@test.com",
                "name": "Developer-3Three"
            }
        ],
        "leader": {
            "_id": "5ad079c8f641c71b6827ea62",
            "email": "leader1@test.com",
            "firstName": "Leader-1",
            "lastName": "One"
        },
        "manager": {
            "_id": "5ad079c8f641c71b6827ea5f",
            "email": "manger1@test.com",
            "firstName": "Manager-1",
            "lastName": "One"
        },
        "project": {
            "_id": "5acf2ccd2db1300fe4c05eba",
            "name": "WFSM"
        },
        "user": {
            "_id": "5acf2ccd2db1300fe4c05eb4",
            "firstName": "Negotiator-1",
            "lastName": "One"
        },
        "__v": 0,
        "taskPlans": [
            {
                "_id": "5aec53bd8321d30a34160cd5",
                "planningDateString": "2018-05-10T12:36:09.012Z",
                "report": {
                    "status": "pending"
                },
                "planning": {
                    "plannedHours": 10
                },
                "flags": [
                    "un-reported"
                ],
                "employee": {
                    "name": "Developer-1One",
                    "_id": "5ad079c9f641c71b6827ea65"
                },
                "releasePlan": {
                    "_id": "5ad07a4cbd999a1230f3865c"
                },
                "release": {
                    "_id": "5ad07a4bbd999a1230f38659"
                },
                "task": {
                    "_id": "5ad04fcd0054e2198c17f2c0",
                    "name": "task 21fhgfghfg"
                },
                "canMerge": false,
                "isShifted": false,
                "planningDate": "2018-05-10T00:00:00.000Z",
                "created": "2018-05-04T12:36:13.669Z",
                "__v": 0
            },
            {
                "_id": "5aec53c68321d30a34160cd6",
                "planningDateString": "2018-05-10T18:30:00.000Z",
                "report": {
                    "status": "pending",
                    "reasons": []
                },
                "planning": {
                    "plannedHours": 12
                },
                "flags": [
                    "un-reported"
                ],
                "employee": {
                    "name": "Developer-1One",
                    "_id": "5ad079c9f641c71b6827ea65"
                },
                "releasePlan": {
                    "_id": "5ad07a4cbd999a1230f3865c"
                },
                "release": {
                    "_id": "5ad07a4bbd999a1230f38659"
                },
                "task": {
                    "_id": "5ad04fcd0054e2198c17f2c0",
                    "name": "task 21fhgfghfg"
                },
                "canMerge": false,
                "isShifted": false,
                "planningDate": "2018-05-10T00:00:00.000Z",
                "created": "2018-05-04T12:43:38.131Z",
                "__v": 1
            },
            {
                "_id": "5aec58ef5f2c3f16dc33ef16",
                "planningDateString": "2018-05-07T13:20:33.720Z",
                "report": {
                    "status": "pending",
                    "reasons": []
                },
                "planning": {
                    "plannedHours": 10
                },
                "flags": [
                    "un-reported"
                ],
                "employee": {
                    "name": "Developer-3Three",
                    "_id": "5ad079c9f641c71b6827ea67"
                },
                "releasePlan": {
                    "_id": "5ad07a4cbd999a1230f3865a"
                },
                "release": {
                    "_id": "5ad07a4bbd999a1230f38659"
                },
                "task": {
                    "_id": "5acf5d0ee8cb950e28ee2c77",
                    "name": "task 11"
                },
                "canMerge": false,
                "isShifted": false,
                "planningDate": "2018-05-07T00:00:00.000Z",
                "created": "2018-05-04T13:20:35.296Z",
                "__v": 1
            },
            {
                "_id": "5aeff018a740a412acb6f4fb",
                "planningDateString": "2018-05-10T06:20:37.696Z",
                "report": {
                    "status": "pending",
                    "reasons": []
                },
                "planning": {
                    "plannedHours": 10
                },
                "flags": [
                    "un-reported"
                ],
                "employee": {
                    "name": "Developer-1One",
                    "_id": "5ad079c9f641c71b6827ea65"
                },
                "releasePlan": {
                    "_id": "5ad07a4cbd999a1230f3865a"
                },
                "release": {
                    "_id": "5ad07a4bbd999a1230f38659"
                },
                "task": {
                    "_id": "5acf5d0ee8cb950e28ee2c77",
                    "name": "task 11"
                },
                "canMerge": false,
                "isShifted": false,
                "planningDate": "2018-05-10T00:00:00.000Z",
                "created": "2018-05-07T06:20:38.630Z",
                "__v": 1
            }
        ]
    },
        {
            "_id": "5ad5f14f5364d22154ac3f0c",
            "name": "v2.0",
            "status": "plan-requested",
            "updated": "2018-04-17T13:04:55.736Z",
            "created": "2018-04-17T13:04:55.736Z",
            "additional": {
                "plannedHoursReportedTasks": 0,
                "estimatedHoursCompletedTasks": 0,
                "estimatedHoursPlannedTasks": 0,
                "reportedHours": 0,
                "plannedHours": 0,
                "estimatedHours": 0,
                "billedHours": 0
            },
            "initial": {
                "clientReleaseDate": "2018-05-17T13:05:34.254Z",
                "devStartDate": "2018-04-18T13:05:19.470Z",
                "devEndDate": "2018-04-28T13:05:26.958Z",
                "plannedHoursReportedTasks": 0,
                "estimatedHoursCompletedTasks": 0,
                "estimatedHoursPlannedTasks": 0,
                "reportedHours": 0,
                "plannedHours": 0,
                "estimatedHours": 0,
                "billedHours": 180
            },
            "team": [
                {
                    "_id": "5ad079c9f641c71b6827ea65",
                    "email": "developer1@test.com",
                    "name": "Developer-1One"
                },
                {
                    "_id": "5ad079c9f641c71b6827ea66",
                    "email": "developer2@test.com",
                    "name": "Developer-2Two"
                },
                {
                    "_id": "5ad079c9f641c71b6827ea67",
                    "email": "developer3@test.com",
                    "name": "Developer-3Three"
                }
            ],
            "leader": {
                "_id": "5ad079c8f641c71b6827ea62",
                "email": "leader1@test.com",
                "firstName": "Leader-1",
                "lastName": "One"
            },
            "manager": {
                "_id": "5ad079c8f641c71b6827ea5f",
                "email": "manger1@test.com",
                "firstName": "Manager-1",
                "lastName": "One"
            },
            "project": {
                "_id": "5acf2ccd2db1300fe4c05ebb",
                "name": "Catalog"
            },
            "user": {
                "_id": "5acf2ccd2db1300fe4c05eb4",
                "firstName": "Negotiator-1",
                "lastName": "One"
            },
            "__v": 0,
            "taskPlans": [
                {
                    "_id": "5add88205d99c21f38feccfe",
                    "planningDateString": "2018-04-24T07:15:39.922Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 3
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-24T07:15:39.922Z",
                    "created": "2018-04-23T07:15:44.634Z",
                    "__v": 0
                },
                {
                    "_id": "5add88295d99c21f38feccff",
                    "planningDateString": "2018-04-24T07:15:48.393Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 3
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-24T07:15:48.393Z",
                    "created": "2018-04-23T07:15:53.519Z",
                    "__v": 0
                },
                {
                    "_id": "5add883f5d99c21f38fecd00",
                    "planningDateString": "2018-04-24T07:15:58.625Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 4
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-24T07:15:58.625Z",
                    "created": "2018-04-23T07:16:15.448Z",
                    "__v": 0
                },
                {
                    "_id": "5add884f5d99c21f38fecd01",
                    "planningDateString": "2018-04-25T07:16:26.242Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 5
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-25T07:16:26.242Z",
                    "created": "2018-04-23T07:16:31.321Z",
                    "__v": 0
                },
                {
                    "_id": "5add885b5d99c21f38fecd02",
                    "planningDateString": "2018-04-25T07:16:35.577Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 3
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-25T07:16:35.577Z",
                    "created": "2018-04-23T07:16:43.899Z",
                    "__v": 0
                },
                {
                    "_id": "5add88735d99c21f38fecd03",
                    "planningDateString": "2018-04-26T07:16:47.841Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 5
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-26T07:16:47.841Z",
                    "created": "2018-04-23T07:17:07.209Z",
                    "__v": 0
                },
                {
                    "_id": "5add8a5c5d99c21f38fecd04",
                    "planningDateString": "2018-04-26T07:25:12.796Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 4
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-2Two",
                        "_id": "5ad079c9f641c71b6827ea66"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-26T07:25:12.796Z",
                    "created": "2018-04-23T07:25:16.734Z",
                    "__v": 0
                },
                {
                    "_id": "5adf1753a36d8b23a85ae3c2",
                    "planningDateString": "2018-04-27T11:38:48.749Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 5
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-27T11:38:48.749Z",
                    "created": "2018-04-24T11:38:59.689Z",
                    "__v": 0
                },
                {
                    "_id": "5adf179d808a8b2b6c573178",
                    "planningDateString": "2018-04-28T11:40:09.043Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 4
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0f"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e354133b5b164486b9fb",
                        "name": "Registration page (basic details) - React"
                    },
                    "planningDate": "2018-04-28T11:40:09.043Z",
                    "created": "2018-04-24T11:40:13.966Z",
                    "__v": 0
                },
                {
                    "_id": "5ae0503879f0951f00edaf9e",
                    "planningDateString": "2018-04-25T09:53:55.671Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 10
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-04-25T00:00:00.000Z",
                    "created": "2018-04-25T09:54:00.960Z",
                    "__v": 0
                },
                {
                    "_id": "5ae0504079f0951f00edaf9f",
                    "planningDateString": "2018-04-26T09:54:04.487Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 45
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-2Two",
                        "_id": "5ad079c9f641c71b6827ea66"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-04-26T00:00:00.000Z",
                    "created": "2018-04-25T09:54:08.462Z",
                    "__v": 0
                },
                {
                    "_id": "5ae0504779f0951f00edafa0",
                    "planningDateString": "2018-04-25T09:54:11.886Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 4
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-04-25T00:00:00.000Z",
                    "created": "2018-04-25T09:54:15.884Z",
                    "__v": 0
                },
                {
                    "_id": "5ae0504f79f0951f00edafa1",
                    "planningDateString": "2018-04-26T09:54:19.158Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 10
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-04-25T00:00:00.000Z",
                    "created": "2018-04-25T09:54:23.792Z",
                    "__v": 0
                },
                {
                    "_id": "5ae2cda014970c1bd872ba72",
                    "planningDateString": "2018-05-08T12:28:43.125Z",
                    "report": {
                        "status": "pending",
                        "reasons": []
                    },
                    "planning": {
                        "plannedHours": 10
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-05-08T00:00:00.000Z",
                    "created": "2018-05-04T12:28:44.632Z",
                    "__v": 1
                },
                {
                    "_id": "5ae329ea204a1119dcf86e10",
                    "planningDateString": "2018-04-28T13:05:26.958Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 10
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-04-28T00:00:00.000Z",
                    "created": "2018-04-27T13:47:22.655Z",
                    "__v": 0
                },
                {
                    "_id": "5ae329f6204a1119dcf86e11",
                    "planningDateString": "2018-04-28T13:05:26.958Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 4
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-04-28T00:00:00.000Z",
                    "created": "2018-04-27T13:47:34.385Z",
                    "__v": 0
                },
                {
                    "_id": "5ae32a00204a1119dcf86e12",
                    "planningDateString": "2018-04-27T13:47:38.383Z",
                    "report": {
                        "status": "pending"
                    },
                    "planning": {
                        "plannedHours": 5
                    },
                    "flags": [
                        "un-reported"
                    ],
                    "employee": {
                        "name": "Developer-1One",
                        "_id": "5ad079c9f641c71b6827ea65"
                    },
                    "releasePlan": {
                        "_id": "5ad5f1505364d22154ac3f0d"
                    },
                    "release": {
                        "_id": "5ad5f14f5364d22154ac3f0c"
                    },
                    "task": {
                        "_id": "5ad5e349133b5b164486b9f8",
                        "name": "Registration API (Node/Koa) basic details"
                    },
                    "planningDate": "2018-04-27T00:00:00.000Z",
                    "created": "2018-04-27T13:47:44.465Z",
                    "__v": 0
                }
            ]
        }],
    selectedProject: {},
    selectedTask: {},
    alltaskPlans: []
}

const reportingReducer = (state = initialState, action) => {
    switch (action.type) {

        case AC.ADD_REPORTING_PROJECTS:
            // All Project where loggedIn user in involved as (manager,leader,developer) or that project
            return Object.assign({}, state, {
                all: action.projects
            })


        default:
            return state
    }
}

export default reportingReducer