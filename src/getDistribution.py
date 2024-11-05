from scipy.linalg import eig

matrix = []

with open("../data/trainline/sparse-matrix.csv") as file:
    for line in file:
        matrix.append(line.strip().split(","))

eigs = eig(matrix, left=True, right=False)
