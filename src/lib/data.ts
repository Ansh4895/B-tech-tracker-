export const webDevTopics = [
  'HTML5 Semantic Elements & Accessibility (a11y)',
  'Modern CSS: Flexbox, Grid, Responsive Design & Tailwind CSS',
  'JavaScript Modern ES6+ (Closures, Promises, Async/Await, Prototypes)',
  'DOM Manipulation, Event Bubbling & Performance Optimization',
  'TypeScript Essentials (Interfaces, Generics, Utility Types)',
  'React 19 Core: Hooks (useState, useEffect, useMemo, useCallback, useRef)',
  'React State Management: Context API, Zustand / Redux Toolkit',
  'Client Routing & Data Fetching (TanStack Query, Axios, SWR)',
  'Node.js Runtime & Express.js RESTful API Architecture',
  'Authentication & Security: JWT, Cookies, OAuth 2.0, bcrypt, CORS',
  'Databases: SQL (PostgreSQL / MySQL) & ORM (Prisma / Drizzle)',
  'Databases: NoSQL (MongoDB, Redis Caching & Pub/Sub)',
  'WebSockets & Real-time Communication (Socket.io)',
  'System Design Basics: Load Balancers, CDN, Rate Limiting, Horizontal Scaling',
  'Git & Version Control: Rebase, Cherry-pick, Pull Request Workflow',
  'Docker Containerization & CI/CD Pipelines (GitHub Actions)',
  'Cloud Deployment: AWS / Vercel / Render & Monitoring',
];

export const dsaTopics = [
  'Arrays: Two Pointers, Prefix Sum, Sliding Window (Kadane, 3Sum)',
  'Strings: Anagrams, Palindromes, KMP / Rabin-Karp pattern matching',
  'Linked Lists: Fast & Slow pointers, Reversal, Cycle Detection, Merge K Lists',
  'Stacks & Queues: Monotonic Stack (Next Greater Element, Trapping Rain Water)',
  'Binary Trees: Traversals (Inorder, Preorder, Postorder, Level Order), Diameter, LCA',
  'Binary Search Trees (BST): Validation, Insertion, Deletion, Kth Smallest',
  'Heaps & Priority Queues: Top K Frequent Elements, Merge K Sorted, Median in Stream',
  'Recursion & Backtracking: Subsets, Permutations, N-Queens, Sudoku Solver',
  'Graphs: BFS & DFS traversals, Cycle Detection (Directed & Undirected)',
  'Graphs: Topological Sort (Kahn\'s Algorithm), Disjoint Set Union (DSU)',
  'Graphs: Shortest Path (Dijkstra\'s, Bellman-Ford, Floyd-Warshall)',
  'Dynamic Programming 1D: Climbing Stairs, House Robber, Coin Change',
  'Dynamic Programming 2D: Grid Paths, 0/1 Knapsack, Longest Common Subsequence',
  'Dynamic Programming on Strings: Edit Distance, Longest Palindromic Substring',
  'Bit Manipulation: XOR tricks, Single Number, Counting Bits',
  'Trie (Prefix Tree): Autocomplete, Longest Common Prefix, Word Search II',
];

export interface CheatTopic {
  name: string;
  category: string;
  points: string[];
}

export const basicTopics: CheatTopic[] = [
  {
    name: 'Operating Systems — Core Concepts',
    category: 'Core CS',
    points: [
      'Processes vs Threads: Processes have separate address spaces; threads share memory and code segment within the same process.',
      'Process States: New → Ready → Running → Waiting (Blocked) → Terminated.',
      'CPU Scheduling: FCFS, SJF (provably optimal average waiting time), Round Robin (time quantum preemption), Multi-level Feedback Queue.',
      'Deadlock Conditions (Coffman): Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
      'Deadlock Handling: Prevention, Avoidance (Banker\'s Algorithm), Detection & Recovery.',
      'Virtual Memory & Paging: Logical to physical address mapping via Page Table & TLB; Page Fault occurs when page is not present in RAM.',
      'Page Replacement Algorithms: FIFO, LRU (Least Recently Used), Optimal (Belady\'s Anomaly occurs in FIFO).',
    ],
  },
  {
    name: 'Database Management Systems (DBMS) & SQL',
    category: 'Core CS',
    points: [
      'ACID Properties: Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (concurrency control), Durability (persisted to disk).',
      'Transactions & Concurrency: Dirty Read, Non-repeatable Read, Phantom Read; Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable).',
      'Database Normalization: 1NF (atomic values), 2NF (no partial dependency on composite key), 3NF (no transitive dependency), BCNF (every determinant is super key).',
      'Indexing: B+ Tree indexing offers O(log N) search and efficient range queries; Clustered (determines physical order) vs Non-Clustered index.',
      'Joins: INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN.',
      'CAP Theorem: A distributed system can guarantee at most 2 out of Consistency, Availability, and Partition Tolerance.',
    ],
  },
  {
    name: 'Object-Oriented Programming (OOPs) & SOLID',
    category: 'Software Engineering',
    points: [
      'Encapsulation: Bundling data and methods operating on that data; hiding internal state via private fields and public getters/setters.',
      'Abstraction: Exposing essential interface features while hiding complex implementation details (Interfaces & Abstract Classes).',
      'Inheritance: IS-A relationship; reusing attributes and behaviors across class hierarchies.',
      'Polymorphism: Compile-time (Method Overloading) vs Run-time (Method Overriding via dynamic dispatch/vtable).',
      'SOLID - Single Responsibility: A class should have only one reason to change.',
      'SOLID - Open/Closed: Software entities should be open for extension, but closed for modification.',
      'SOLID - Liskov Substitution: Subtypes must be substitutable for their base types without altering correctness.',
      'SOLID - Interface Segregation & Dependency Inversion: Many client-specific interfaces; depend upon abstractions, not concretions.',
    ],
  },
  {
    name: 'Computer Networks — Protocols & Layers',
    category: 'Core CS',
    points: [
      'OSI Model (7 Layers): Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      'TCP vs UDP: TCP is connection-oriented, reliable, ordered, flow & congestion controlled; UDP is connectionless, lightweight, low-latency (DNS, VoIP, gaming).',
      'TCP 3-Way Handshake: SYN → SYN-ACK → ACK. TCP 4-Way Termination: FIN → ACK → FIN → ACK.',
      'HTTP vs HTTPS: HTTPS encrypts communication using TLS/SSL over port 443 with asymmetric handshakes and symmetric session keys.',
      'HTTP Status Codes: 2xx (Success), 3xx (Redirection), 4xx (Client Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found), 5xx (Server Error: 500, 502, 503).',
      'DNS Lookup Process: Browser cache → OS cache → Resolving Name Server → Root Server → TLD Server (.com) → Authoritative Server.',
    ],
  },
  {
    name: 'System Design & High-Level Architecture',
    category: 'System Design',
    points: [
      'Vertical Scaling (Scale-up) vs Horizontal Scaling (Scale-out with stateless nodes).',
      'Load Balancers: Round Robin, Weighted, Least Connections, IP Hash (Layer 4 vs Layer 7 load balancing).',
      'Caching Strategies: Cache-Aside, Write-Through, Write-Behind, Refresh-Ahead; Eviction policies (LRU, LFU, FIFO).',
      'Database Sharding & Replication: Master-Slave replication for read-heavy apps; Horizontal sharding by hash key for massive writes.',
      'Message Queues & Asynchronous Processing: Decoupling services using Kafka, RabbitMQ, or SQS for background workloads and event-driven architecture.',
      'Rate Limiting Algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log.',
    ],
  },
];

export const languages = [
  { id: 'java', name: 'Java', version: 'OpenJDK 21', icon: '☕' },
  { id: 'cpp', name: 'C++', version: 'GCC 13.2', icon: '⚡' },
  { id: 'python', name: 'Python', version: 'Python 3.12', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', version: 'Node.js 20', icon: '🟨' },
];

export interface CodeTemplate {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  starterCodes: {
    java: string;
    cpp: string;
    python: string;
    javascript: string;
  };
}

export const codeTemplates: CodeTemplate[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hash Table',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    starterCodes: {
      java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = sol.twoSum(nums, target);
        System.out.println("Result: [" + result[0] + ", " + result[1] + "]");
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = sol.twoSum(nums, 9);
    cout << "Indices: [" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test Case
nums = [2, 7, 11, 15]
target = 9
print("Result:", two_sum(nums, target))`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
console.log("Result indices:", twoSum(nums, target));`,
    },
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    starterCodes: {
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        Solution sol = new Solution();
        ListNode rev = sol.reverseList(head);
        System.out.println("Reversed head val: " + rev.val);
    }
}`,
      cpp: `#include <iostream>

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
};

int main() {
    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    Solution sol;
    ListNode* rev = sol.reverseList(head);
    std::cout << "Reversed head: " << rev->val << std::endl;
    return 0;
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

head = ListNode(1, ListNode(2, ListNode(3)))
rev = reverse_list(head)
print("Reversed head value:", rev.val)`,
      javascript: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}

const head = new ListNode(1, new ListNode(2, new ListNode(3)));
const rev = reverseList(head);
console.log("Reversed head:", rev.val);`,
    },
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: 'Given a string `s` containing just characters `()[]{}` determine if the input string is valid.',
    starterCodes: {
      java: `import java.util.Stack;

public class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println("isValid '()[]{}': " + sol.isValid("()[]{}"));
        System.out.println("isValid '(]': " + sol.isValid("(]"));
    }
}`,
      cpp: `#include <iostream>
#include <stack>
#include <string>

using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else {
                if (st.empty() || st.top() != c) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};

int main() {
    Solution sol;
    cout << "Test '()[]{}': " << (sol.isValid("()[]{}") ? "true" : "false") << endl;
    return 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

print("is_valid('()[]{}'):", is_valid("()[]{}"))
print("is_valid('(]'):", is_valid("(]"))`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}

console.log("isValid '()[]{}':", isValid("()[]{}"));
console.log("isValid '(]':", isValid("(]"));`,
    },
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray (Kadane\'s)',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    starterCodes: {
      java: `public class Solution {
    public int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currMax = Math.max(nums[i], currMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currMax);
        }
        return maxSoFar;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println("Maximum Subarray Sum: " + sol.maxSubArray(nums));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSoFar = nums[0], curr = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            curr = max(nums[i], curr + nums[i]);
            maxSoFar = max(maxSoFar, curr);
        }
        return maxSoFar;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "Max Sum: " << sol.maxSubArray(nums) << endl;
    return 0;
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    curr = max_so_far = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        max_so_far = max(max_so_far, curr)
    return max_so_far

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print("Max Subarray:", max_sub_array(nums))`,
      javascript: `function maxSubArray(nums) {
  let curr = nums[0];
  let maxSoFar = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    maxSoFar = Math.max(maxSoFar, curr);
  }
  return maxSoFar;
}

const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("Max Subarray:", maxSubArray(nums));`,
    },
  },
];

export interface Subject {
  code: string;
  name: string;
  sem: number;
  credits: number;
  units: string[];
  totalLectures: number;
  attendedLectures: number;
  resources: { title: string; link: string }[];
}

export const initialSemesterSubjects: Record<number, Subject[]> = {
  1: [
    {
      code: 'AM-101',
      name: 'Applied Mathematics - I',
      sem: 1,
      credits: 4,
      units: ['Calculus & Mean Value Theorems', 'Linear Algebra & Matrices', 'Infinite Series', 'Differential Equations', 'Vector Calculus'],
      totalLectures: 40,
      attendedLectures: 35,
      resources: [{ title: 'Erwin Kreyszig Higher Engg Math', link: '#' }],
    },
    {
      code: 'AP-102',
      name: 'Applied Physics',
      sem: 1,
      credits: 4,
      units: ['Optics & Interference', 'Lasers & Fiber Optics', 'Quantum Mechanics Basics', 'Semiconductor Physics', 'Nanomaterials'],
      totalLectures: 38,
      attendedLectures: 32,
      resources: [{ title: 'Physics for Engineers', link: '#' }],
    },
    {
      code: 'BEE-103',
      name: 'Basic Electrical & Electronics',
      sem: 1,
      credits: 4,
      units: ['DC Circuits & Theorems', 'AC Single & Polyphase', 'Transformers & Motors', 'Diodes & Transistors', 'Digital Gates'],
      totalLectures: 42,
      attendedLectures: 36,
      resources: [{ title: 'Electrical Fundamentals', link: '#' }],
    },
    {
      code: 'EG-104',
      name: 'Engineering Graphics & CAD',
      sem: 1,
      credits: 3,
      units: ['Orthographic Projections', 'Isometric Projections', 'Sections of Solids', 'AutoCAD 2D Modeling'],
      totalLectures: 30,
      attendedLectures: 27,
      resources: [{ title: 'ND Bhatt Engg Drawing', link: '#' }],
    },
    {
      code: 'CS-105',
      name: 'Communication Skills',
      sem: 1,
      credits: 2,
      units: ['Professional Writing', 'Verbal Communication & GD', 'Technical Presentations', 'Interview Etiquette'],
      totalLectures: 24,
      attendedLectures: 22,
      resources: [{ title: 'Business Communication Handbook', link: '#' }],
    },
  ],
  2: [
    {
      code: 'AM-201',
      name: 'Applied Mathematics - II',
      sem: 2,
      credits: 4,
      units: ['Complex Variables', 'Laplace Transforms', 'Fourier Series', 'Numerical Methods', 'Probability Distributions'],
      totalLectures: 42,
      attendedLectures: 37,
      resources: [{ title: 'Advanced Engg Math Vol II', link: '#' }],
    },
    {
      code: 'CS-202',
      name: 'Programming & Data Structures in C',
      sem: 2,
      credits: 4,
      units: ['Pointers & Dynamic Memory', 'Structures & Unions', 'Linear Linked Lists', 'Stacks & Queues', 'Sorting & Searching'],
      totalLectures: 44,
      attendedLectures: 40,
      resources: [{ title: 'Dennis Ritchie C Programming', link: '#' }],
    },
    {
      code: 'EC-203',
      name: 'Digital Electronics & Logic Design',
      sem: 2,
      credits: 4,
      units: ['Boolean Algebra & K-Maps', 'Combinational Circuits', 'Sequential Circuits & Flip-Flops', 'Registers & Counters', 'Memory & Logic Families'],
      totalLectures: 38,
      attendedLectures: 33,
      resources: [{ title: 'Morris Mano Digital Design', link: '#' }],
    },
    {
      code: 'CH-204',
      name: 'Engineering Chemistry & Materials',
      sem: 2,
      credits: 3,
      units: ['Water Technology', 'Polymers & Composites', 'Corrosion & Protection', 'Fuels & Combustion'],
      totalLectures: 34,
      attendedLectures: 29,
      resources: [{ title: 'Engg Chemistry Essentials', link: '#' }],
    },
    {
      code: 'ES-205',
      name: 'Environmental Studies & Ecology',
      sem: 2,
      credits: 2,
      units: ['Ecosystems & Biodiversity', 'Pollution Control & Regulations', 'Renewable Energy', 'Disaster Management'],
      totalLectures: 24,
      attendedLectures: 22,
      resources: [{ title: 'Ecology Notes', link: '#' }],
    },
  ],
  3: [
    {
      code: 'CS-301',
      name: 'Data Structures & Algorithms',
      sem: 3,
      credits: 4,
      units: ['Asymptotic Analysis & Complexities', 'Advanced Trees (AVL, Red-Black)', 'Graph Algorithms (BFS/DFS/Dijkstra)', 'Dynamic Programming & Greedy', 'Hashing & String Matching'],
      totalLectures: 46,
      attendedLectures: 42,
      resources: [{ title: 'CLRS Algorithms Handbook', link: '#' }],
    },
    {
      code: 'CS-302',
      name: 'Object-Oriented Programming (Java)',
      sem: 3,
      credits: 4,
      units: ['Classes, Objects & Inheritance', 'Interfaces & Abstract Classes', 'Exception Handling & Generics', 'Java Collections Framework', 'Multithreading & Concurrency'],
      totalLectures: 44,
      attendedLectures: 39,
      resources: [{ title: 'Effective Java 3rd Edition', link: '#' }],
    },
    {
      code: 'CS-303',
      name: 'Discrete Mathematics',
      sem: 3,
      credits: 4,
      units: ['Set Theory & Relations', 'Propositional & Predicate Logic', 'Combinatorics & Recurrence Relations', 'Graph Theory', 'Algebraic Structures & Groups'],
      totalLectures: 40,
      attendedLectures: 34,
      resources: [{ title: 'Kenneth Rosen Discrete Math', link: '#' }],
    },
    {
      code: 'CS-304',
      name: 'Computer Architecture & Organization',
      sem: 3,
      credits: 4,
      units: ['Instruction Set Architecture (MIPS)', 'ALU Design & Pipelining', 'Memory Hierarchy & Cache Memory', 'Virtual Memory & I/O Systems', 'Multicore & Parallelism'],
      totalLectures: 40,
      attendedLectures: 35,
      resources: [{ title: 'Patterson & Hennessy Comp Org', link: '#' }],
    },
    {
      code: 'HU-305',
      name: 'Universal Human Values & Professional Ethics',
      sem: 3,
      credits: 2,
      units: ['Harmony in Self', 'Harmony in Family & Society', 'Ethics in Engineering Practice', 'Sustainability'],
      totalLectures: 24,
      attendedLectures: 21,
      resources: [{ title: 'Ethics in Tech Handbook', link: '#' }],
    },
  ],
  4: [
    {
      code: 'CS-401',
      name: 'Operating Systems',
      sem: 4,
      credits: 4,
      units: ['Process & Thread Management', 'CPU Scheduling Algorithms', 'Synchronization & Semaphores', 'Memory Management & Paging', 'File Systems & Storage'],
      totalLectures: 44,
      attendedLectures: 0,
      resources: [{ title: 'Silberschatz OS Concepts', link: '#' }],
    },
    {
      code: 'CS-402',
      name: 'Database Management Systems',
      sem: 4,
      credits: 4,
      units: ['ER Modeling & Relational Algebra', 'Advanced SQL & Normalization (1NF-BCNF)', 'Transaction Management & ACID', 'Concurrency Control & Recovery', 'Indexing & B+ Trees'],
      totalLectures: 44,
      attendedLectures: 0,
      resources: [{ title: 'Ramakrishnan Database Systems', link: '#' }],
    },
    {
      code: 'CS-403',
      name: 'Theory of Computation',
      sem: 4,
      credits: 4,
      units: ['Finite Automata (DFA, NFA)', 'Regular Expressions & Pumping Lemma', 'Context-Free Grammars & PDA', 'Turing Machines', 'Decidability & NP-Completeness'],
      totalLectures: 42,
      attendedLectures: 0,
      resources: [{ title: 'Michael Sipser Theory of Computation', link: '#' }],
    },
    {
      code: 'CS-404',
      name: 'Computer Networks',
      sem: 4,
      credits: 4,
      units: ['Physical & Data Link Protocols', 'Network Layer (IP, Routing, Subnetting)', 'Transport Layer (TCP, UDP, Flow Control)', 'Application Protocols (DNS, HTTP, SMTP)', 'Network Security Fundamentals'],
      totalLectures: 44,
      attendedLectures: 0,
      resources: [{ title: 'Kurose & Ross Computer Networking', link: '#' }],
    },
    {
      code: 'CS-405',
      name: 'Software Engineering & Agile',
      sem: 4,
      credits: 3,
      units: ['Software Development Life Cycles', 'Agile & Scrum Methodologies', 'UML Architecture & Design Patterns', 'Software Testing (Unit, Integration, CI/CD)'],
      totalLectures: 32,
      attendedLectures: 0,
      resources: [{ title: 'Pressman Software Engineering', link: '#' }],
    },
  ],
  5: [
    {
      code: 'CS-501',
      name: 'Design & Analysis of Algorithms',
      sem: 5,
      credits: 4,
      units: ['Divide & Conquer Analysis', 'Greedy & Matroids', 'Dynamic Programming Optimization', 'String Matching Algorithms', 'Approximation & Randomized Algorithms'],
      totalLectures: 44,
      attendedLectures: 0,
      resources: [{ title: 'Kleinberg Algorithm Design', link: '#' }],
    },
    {
      code: 'CS-502',
      name: 'Web Technologies & Cloud Fundamentals',
      sem: 5,
      credits: 4,
      units: ['Modern Web Architecture', 'REST APIs & Microservices', 'Single Page Apps (React)', 'Cloud Service Models (IaaS, PaaS, SaaS)', 'Containerization basics'],
      totalLectures: 40,
      attendedLectures: 0,
      resources: [{ title: 'Fullstack Roadmap', link: '#' }],
    },
    {
      code: 'CS-503',
      name: 'Information & Network Security',
      sem: 5,
      credits: 4,
      units: ['Cryptography (RSA, AES, ECC)', 'Authentication & Hash Functions', 'Firewalls & Intrusion Detection', 'Web Application Vulnerabilities (OWASP Top 10)'],
      totalLectures: 38,
      attendedLectures: 0,
      resources: [{ title: 'Stallings Cryptography', link: '#' }],
    },
  ],
  6: [
    {
      code: 'CS-601',
      name: 'Compiler Design',
      sem: 6,
      credits: 4,
      units: ['Lexical Analysis & Flex', 'Syntax Analysis & Parsing (LL, LR, LALR)', 'Syntax Directed Translation', 'Intermediate Code Generation', 'Code Optimization & Target Code Gen'],
      totalLectures: 44,
      attendedLectures: 0,
      resources: [{ title: 'Dragon Book Compilers', link: '#' }],
    },
    {
      code: 'CS-602',
      name: 'Artificial Intelligence & Machine Learning',
      sem: 6,
      credits: 4,
      units: ['Search Algorithms (A*, Minimax)', 'Knowledge Representation', 'Supervised Learning (Regression, Classification)', 'Unsupervised Learning (Clustering, PCA)', 'Neural Networks & Deep Learning Intro'],
      totalLectures: 44,
      attendedLectures: 0,
      resources: [{ title: 'Russell & Norvig AI Modern Approach', link: '#' }],
    },
  ],
  7: [
    {
      code: 'CS-701',
      name: 'Distributed Systems & Cloud Computing',
      sem: 7,
      credits: 4,
      units: ['Distributed Architecture & RPC', 'Consensus (Raft, Paxos)', 'Distributed Storage (GFS, HDFS)', 'Kubernetes & Serverless Computing'],
      totalLectures: 40,
      attendedLectures: 0,
      resources: [{ title: 'Designing Data-Intensive Applications', link: '#' }],
    },
    {
      code: 'CS-702',
      name: 'Major Project Phase - I',
      sem: 7,
      credits: 6,
      units: ['Problem Identification & Literature Review', 'System Requirement Specification', 'Architecture Design & Prototyping', 'Mid-Term Evaluation'],
      totalLectures: 30,
      attendedLectures: 0,
      resources: [{ title: 'Project Guidelines', link: '#' }],
    },
  ],
  8: [
    {
      code: 'CS-801',
      name: 'Full-Stack System Architecture',
      sem: 8,
      credits: 4,
      units: ['Scalability & High Availability', 'Event-Driven Architectures', 'Observability & Metrics', 'Production Deployment & Reliability'],
      totalLectures: 36,
      attendedLectures: 0,
      resources: [{ title: 'Modern Architecture Handbook', link: '#' }],
    },
    {
      code: 'CS-802',
      name: 'Industrial Internship / Major Project Phase - II',
      sem: 8,
      credits: 10,
      units: ['System Implementation', 'Comprehensive Testing', 'Final Deployment & Code Review', 'Viva-Voce & Dissertation'],
      totalLectures: 40,
      attendedLectures: 0,
      resources: [{ title: 'Internship Guidelines', link: '#' }],
    },
  ],
};
