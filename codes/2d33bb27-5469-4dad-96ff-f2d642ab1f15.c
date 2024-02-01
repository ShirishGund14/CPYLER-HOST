#include <stdio.h>

int main() {
    int n, sum = 0;

    // Get user input
    printf("Enter the value of n: ");
    scanf("%d", &n);

    // Calculate the sum of first n natural numbers
    for (int i = 1; i <= n; ++i) {
        sum += i;
    }

    // Display the result
    printf("Sum of first %d natural numbers is: %d\n", n, sum);

    return 0;
}
