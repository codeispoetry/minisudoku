deploy:
	rsync -av --delete ./ laurin:httpdocs/sudoku/ --exclude '.git/' --exclude 'Makefile'  --exclude '.vscode/'