// pre
import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { AccountType, CategoryType } from '../libs/api-interfaces/src';

const prisma = new PrismaClient();

async function main() {
  const rod = await prisma.user.upsert({
    where: { email: 'rodpattison@gmail.com' },
    update: {},
    create: {
      email: 'rodpattison@gmail.com',
      name: 'Rod Pattison',
      googleId: '115151736682656548981'
    },
  });

  const catIncome = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Income' } },
    update: {},
    create: { name: 'Income', order: 0, path: 'Income', type: CategoryType.Income, userId: rod.id },
  });
  const catIncomeSalary = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Income / Salary & Wages' } },
    update: {},
    create: { name: 'Salary & Wages', order: 0, path: 'Income / Salary & Wages', type: CategoryType.Income, userId: rod.id, parentId: catIncome.id },
  });
  const catBanking = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Banking & Finance' } },
    update: {},
    create: { name: 'Banking & Finance', order: 0, path: 'Banking & Finance', type: CategoryType.Expense, userId: rod.id },
  });
  const catBankingLoan = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Banking & Finance / Loan Repayments' } },
    update: {},
    create: { name: 'Loan Repayments', order: 0, path: 'Banking & Finance / Loan Repayments', type: CategoryType.Expense, userId: rod.id, parentId: catBanking.id },
  });
  const catBankingInvestment = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Banking & Finance / Investment' } },
    update: {},
    create: { name: 'Investment', order: 0, path: 'Banking & Finance / Investment', type: CategoryType.Expense, userId: rod.id, parentId: catBanking.id },
  });
  const catGroceries = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Groceries' } },
    update: {},
    create: { name: 'Groceries', order: 0, path: 'Groceries ', type: CategoryType.Expense, userId: rod.id },
  });
  const catGroceriesSupermarkets = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Groceries / Supermarkets' } },
    update: {},
    create: { name: 'Supermarkets', order: 0, path: 'Groceries / Supermarkets', type: CategoryType.Expense, userId: rod.id, parentId: catGroceries.id },
  });
  const catTransferring = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Transferring Money' } },
    update: {},
    create: { name: 'Transferring Money', order: 0, path: 'Transferring Money', type: CategoryType.Transfer, userId: rod.id },
  });
  const catTransferringSavings = await prisma.category.upsert({
    where: { userId_path: { userId: rod.id, path: 'Transferring Money / Savings' } },
    update: {},
    create: { name: 'Savings', order: 0, path: 'Transferring Money / Savings', type: CategoryType.Transfer, userId: rod.id, parentId: catTransferring.id },
  });

  const accMain = await prisma.account.upsert({
    where: { userId_name: {name: 'Main Account', userId: rod.id } },
    update: {},
    create: { name: 'Main Account', type: AccountType.Cash, balance: 100.0, userId: rod.id }
  });

  const accCredit = await prisma.account.upsert({
    where: { userId_name: {name: 'Credit Card', userId: rod.id } },
    update: {},
    create: { name: 'Credit Card', type: AccountType.Credit, balance: -100.0, userId: rod.id }
  });

  const accLoan = await prisma.account.upsert({
    where: { userId_name: {name: 'Home Loan', userId: rod.id } },
    update: {},
    create: { name: 'Home Loan', type: AccountType.Loan, balance: -1000.0, userId: rod.id }
  });

  const accountIds = [accMain, accCredit, accLoan].map(a => a.id)
  const categoryIds = [catIncomeSalary, catBankingLoan, catBankingInvestment, catGroceriesSupermarkets, catTransferringSavings].map(c =>c.id)

  const transactions: Prisma.TransactionCreateInput[] = Array.from({length: 100}, (v,i) => {
    return { 
      date: faker.date.recent(),// new Date('2022-01-01'), 
      amount: new Prisma.Decimal(faker.finance.amount(1,500,2)), 
      description: faker.lorem.words(5), 
      account: { connect : { id: faker.helpers.arrayElement(accountIds) } }, 
      category: { connect: { id: faker.helpers.arrayElement(categoryIds) } }, 
      user: { connect: { id: rod.id }} }
  });
  
  // [
    // { date: new Date('2022-01-02'), amount: new Prisma.Decimal(-50.00), description: faker.lorem.words(5), account: { connect : { id: accMain.id } }, category: { connect: { id: catBankingLoan.id} }, user: { connect: { id: rod.id }} },
    // { date: new Date('2022-01-03'), amount: new Prisma.Decimal(-30.00), description: faker.lorem.words(5), account: { connect : { id: accMain.id } }, category: { connect: { id: catGroceriesSupermarkets.id} }, user: { connect: { id: rod.id }} },
    // { date: new Date('2022-01-04'), amount: new Prisma.Decimal(-10.00), description: faker.lorem.words(5), account: { connect : { id: accMain.id } }, category: { connect: { id: catTransferringSavings.id} }, user: { connect: { id: rod.id }} },
    // { date: new Date('2022-01-05'), amount: new Prisma.Decimal(-5.00), description: faker.lorem.words(5), account: { connect : { id: accMain.id } }, category: { connect: { id: catBankingInvestment.id} }, user: { connect: { id: rod.id }} },
  // ];

  Promise.all(transactions.map(t => prisma.transaction.aggregate))

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction
    })
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
