import keccak256 from "keccak256"; // Keccak256 hashing
import MerkleTree from "merkletreejs"; // MerkleTree.js
import {getAddress, solidityKeccak256} from "ethers/lib/utils"; // Ethers utils

// Airdrop recipient addresses and scaled token values
type AirdropRecipient = {
    // Recipient address
    address: string;
    // Scaled-to-decimals token value
    values: string[];
};

export default class MerkleTreeWithMultiValuesGenerator {
    // Airdrop recipients
    recipients: AirdropRecipient[] = [];
    tree: MerkleTree = new MerkleTree([]);

    /**
     * Setup generator
     * @param {Record<string, number>} airdrop address to token claim mapping
     */
    constructor(airdrop: Record<string, string[]>) {
        // For each airdrop entry
        for (const [address, amounts] of Object.entries(airdrop)) {
            // Push:
            this.recipients.push({
                address: getAddress(address),
                values: amounts
            });
        }
    }

    /**
     * Generate Merkle Tree leaf from address and value
     * @param {string} address of airdrop claimee
     * @param {string} values of airdrop tokens to claimee
     * @returns {Buffer} Merkle Tree node
     */
    generateLeaf(address: string, values: string[]): Buffer {
        return Buffer.from(
            // Hash in appropriate Merkle format
            solidityKeccak256(["address", "uint256[]"], [address, values]).slice(2),
            "hex"
        );
    }

    async process(): Promise<string> {
        // Generate merkle tree
        this.tree = new MerkleTree(
            // Generate leafs
            this.recipients.map(({ address, values }) =>
                this.generateLeaf(address, values)
            ),
            // Hashing function
            keccak256,
            { sortPairs: true }
        );

        return this.tree.getHexRoot();
    }

    generateProof(address: string, values: string[]): string[] {
        return this.tree.getHexProof(this.generateLeaf(address, values));
    }
}