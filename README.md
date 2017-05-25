# Architecture Diagram

![alt tag](https://github.com/tuanungquoc/cmpe281_portal/blob/master/portal/281team.png)

Building a multi-cloud Starbucks Drink Ordering portal. The components of the solution includes:

- Portal:  HBased Web Application from which Starbucks Orders and be placed and viewed.  Orders should be multi-tenant such that each tenant is a different Starbucks Store. The portal was built by using Express Nodejs

- API Gateway:
A Kong API Gateway that is deployed on AWS with a 3-Node Cassandra DB Cluster. The API Gateway will route all REST API calls.

-Tenant API Back-Ends:

Two REST API back-ends that is implemented in Nodejs+ MongoDB cluster with 3 nodes  and Pythong + DynamoDB 
These two backend was deployed to separate AWS VPCs.


