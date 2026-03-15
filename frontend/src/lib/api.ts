const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;

interface GraphQLResponse<T> {
    data?: T;
    errors?: Array<{ message: string }>;
}

export async function graphqlRequest<T>(
    query: string,
    variables?: Record<string, any>,
    token?: string
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors) {
        throw new Error(json.errors[0]?.message || 'GraphQL Error');
    }

    if (!json.data) {
        throw new Error('No data returned from GraphQL');
    }

    return json.data;
}

// Auth helpers
export function getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

export function removeAuthToken(): void {
    localStorage.removeItem('auth_token');
}

export function getCurrentUser(): any {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

export function setCurrentUser(user: any): void {
    localStorage.setItem('current_user', JSON.stringify(user));
}

export function clearAuth(): void {
    removeAuthToken();
    localStorage.removeItem('current_user');
}
