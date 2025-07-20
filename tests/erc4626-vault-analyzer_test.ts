import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "ERC4626 Vault Analyzer: Vault Configuration",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('erc4626-vault-analyzer', 'configure-vault', [
                types.uint(1),
                types.uint(10000),
                types.uint(50),
                types.uint(5000),
                types.uint(5000)
            ], deployer.address)
        ]);

        assertEquals(block.receipts[0].result, '(ok true)');
    }
});

Clarinet.test({
    name: "ERC4626 Vault Analyzer: Deposit Functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;

        // First configure vault
        chain.mineBlock([
            Tx.contractCall('erc4626-vault-analyzer', 'configure-vault', [
                types.uint(1),
                types.uint(10000),
                types.uint(50),
                types.uint(5000),
                types.uint(5000)
            ], deployer.address)
        ]);

        // Then deposit
        const block = chain.mineBlock([
            Tx.contractCall('erc4626-vault-analyzer', 'deposit', [
                types.uint(1),
                types.uint(1000)
            ], user.address)
        ]);

        assertEquals(block.receipts[0].result, '(ok true)');
    }
});

Clarinet.test({
    name: "ERC4626 Vault Analyzer: Withdrawal Functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;

        // Configure vault
        chain.mineBlock([
            Tx.contractCall('erc4626-vault-analyzer', 'configure-vault', [
                types.uint(1),
                types.uint(10000),
                types.uint(50),
                types.uint(5000),
                types.uint(5000)
            ], deployer.address)
        ]);

        // Deposit first
        chain.mineBlock([
            Tx.contractCall('erc4626-vault-analyzer', 'deposit', [
                types.uint(1),
                types.uint(1000)
            ], user.address)
        ]);

        // Then withdraw
        const block = chain.mineBlock([
            Tx.contractCall('erc4626-vault-analyzer', 'withdraw', [
                types.uint(1),
                types.uint(500)
            ], user.address)
        ]);

        assertEquals(block.receipts[0].result, '(ok true)');
    }
});