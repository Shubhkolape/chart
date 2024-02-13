// list(query?: Record<string, string> | undefined): Promise<Session[]>

// List sessions, optionally filter by query parameters.

// Supported query parameters:

// filter_XXX - where XXX is replaced by your customData field names. e.g. filter_user_id=abc would filter devices with customData = { user_id: 'abc' }

// activated_before - only include sessions that were activated before this date. Useful for paging.

// activated_after - only include devices that were activated after this date. Useful for paging.

// agent - Administrator may set this to all to list sessions for all agents. Agent roles may only list their own sessions.

// state - Filter by session that are in one of the supported states: pending, authorizing, active, ended.





// list(agent='something')
// list(activated_before='something')
// list(activated_after='something')

// "6467482d346e69cb6c48919b"


