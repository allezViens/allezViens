from py2neo import Graph, watch, Node, Relationship, Path

#watch requests to db-server
# watch("httpstream")

#connect to localhost:7474
# graph = Graph()

# def createWaypoint( coordinates ):
#   return graph.merge_one("Waypoint", "coordinates", coordinates)

# #origin and destination are dictionaries 
# def createDriver( origin, destination, id ):
#   driver = graph.merge_one("Driver", "id", id)
#   graph.create_unique(Relationship(driver, "ORIGIN", createWaypoint(origin) ))
#   graph.create_unique(Relationship(driver, "DESTINATION", createWaypoint(destination) ))

# # create node:Passenger with 
# def createPassenger( origin, destination, id):
#   passenger = graph.merge_one("Passenger", "id", id)
#   graph.create_unique(Relationship(passenger, "ORIGIN", createWaypoint(origin) ))
#   graph.create_unique(Relationship(passenger, "DESTINATION", createWaypoint(destination) ))

# #return all nodes with same origin and destination 
# #origin and destination are arrays [lat,long]
# def findNodes( label, origin, destination ):
#   a = "(origin {coordinates : %s})" % origin
#   b = "(destination {coordinates: %s})" % destination
#   query = "MATCH %s <-[:ORIGIN]-(passengers:%s)-[:DESTINATION]->%s return passengers" %(a,label,b)
#   return graph.cypher.execute(query)

# def findDrivers( origin, destination ):
#   return findNodes("Driver", origin, destination)

# def findPassengers ( origin, destination ):
#   return findNodes("Passenger", origin, destination)

# createDriver([10,12], [43,45], "Jon")
# origin = [10,12]
# destination = [43,45]
# createPassenger(origin, destination, "Adam")
# createPassenger(origin, destination, "Tony")
# print(findPassengers(origin, destination))
