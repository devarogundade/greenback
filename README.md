# GreenBack

## PROBLEM STATEMENTS

- Plastic bottles are among the most prevalent forms of waste pollution globally, with over 500 billion produced annually. Despite being fully recyclable, only around 7% of collected plastic bottles are turned into new bottles, while the rest contribute to environmental degradation. An estimated 8 million metric tons of plastic waste, including bottles, enter the oceans each year, posing a serious threat to ecosystems and human health.

- The lack of sufficient public good initiatives has led to a decline in charitable donations. This reduction in funding further hinders efforts to address pressing social and environmental challenges, making it increasingly difficult to support causes that promote sustainable development and community well-being.

## OUR SOLUTION

To address these problems, we are developing a smart reverse vending machine designed to accept any type of recyclable plastic bottle. These machines will be strategically placed in local areas such as malls and parks. Each machine functions as a specialized unit equipped to:

*Authenticate users via RFID cards or QR codes.*

*Reject non-recyclable waste, and sorting using Artificial Inteligence.*

*Determine the weight of recycled materials.*

*Operate with energy-efficient features.*

The machine is connected to the GreenBack server, which will credit users with $GCoin for their recycling efforts. Users can then manage their earnings through a web application linked to their Aptos wallet. The $GCoin can either be donated to selected charities or swapped into Aptos coin for personal use.

[Less technical details](https://dorahacks.io/buidl/14559/)

## TECHNICAL COMPONENTS

#### Reverse Vending Machine 

Hardware for collecting and processing recyclable plastic bottles.

![rvm-2.png](https://cdn.dorahacks.io/static/files/191f4e9c0359167eefcc4ac48948c3f9.png)

#### Smart Contracts

Blockchain-based contracts that manage $GCoin distribution, DAO voting, and fund allocation.

[deployed contract](https://explorer.aptoslabs.com/object/0xda3b1109be114106701a7a8efbf5e91ea8f18827f86585035c04bfc49d9b38dd?network=testnet)

#### Web Server & Application

User interface for managing $GCoin, participating in DAO voting, and accessing rewards.

[web server endpoint](https://greenback-f7gahzfrbybffxf0.canadacentral-01.azurewebsites.net/) |
[web app endpoint](https://thegreenback.xyz)
